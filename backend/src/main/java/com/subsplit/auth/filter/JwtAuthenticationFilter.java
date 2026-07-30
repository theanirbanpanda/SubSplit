package com.subsplit.auth.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.subsplit.auth.service.CustomUserDetailsService;
import com.subsplit.auth.service.JwtService;
import com.subsplit.auth.util.JwtConstants;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader
                = request.getHeader(JwtConstants.HEADER);

        if (authHeader == null
                || !authHeader.startsWith(JwtConstants.TOKEN_PREFIX)) {

            filterChain.doFilter(request, response);
            return;
        }

        String jwt
                = authHeader.substring(JwtConstants.TOKEN_PREFIX.length());

        try {
            String email
                    = jwtService.extractUsername(jwt);

            if (email != null
                    && SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails user
                        = userDetailsService.loadUserByUsername(email);

                if (jwtService.isTokenValid(jwt, user) && user.isEnabled()) {


                    UsernamePasswordAuthenticationToken authentication
                            = new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    user.getAuthorities());

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request));

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(authentication);
                }
            }
        } catch (Exception ex) {
            logger.warn("Invalid or expired JWT token: " + ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
