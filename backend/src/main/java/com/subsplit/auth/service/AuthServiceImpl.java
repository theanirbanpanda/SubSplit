package com.subsplit.auth.service;

import com.subsplit.auth.dto.AuthResponse;
import com.subsplit.auth.dto.LoginRequest;
import com.subsplit.auth.dto.RefreshTokenRequest;
import com.subsplit.auth.dto.RegisterRequest;
import com.subsplit.common.entity.Role;
import com.subsplit.common.entity.User;
import com.subsplit.common.exception.ResourceNotFoundException;
import com.subsplit.common.exception.UnauthorizedException;
import com.subsplit.common.exception.UserAlreadyExistsException;
import com.subsplit.user.repository.RoleRepository;
import com.subsplit.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.subsplit.notification.service.NotificationService;
import com.subsplit.common.enums.NotificationType;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final NotificationService notificationService;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered.");
        }

        Role role = roleRepository.findByName("USER")
                .orElseThrow(() -> new ResourceNotFoundException("Default role not found"));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .isActive(true)
                .emailVerified(false)
                .build();

        com.subsplit.common.entity.UserProfile profile = com.subsplit.common.entity.UserProfile.builder()
                .user(user)
                .build();

        user.setProfile(profile);
        User savedUser = userRepository.save(user);

        try {
            notificationService.createNotification(
                    savedUser,
                    NotificationType.SYSTEM,
                    "Welcome to SubSplit! 👋",
                    "Your account has been created. Explore subscription groups or list your extra seats."
            );
            notificationService.createNotification(
                    savedUser,
                    NotificationType.SYSTEM,
                    "Action Required: Complete KYC 🛡️",
                    "Please complete your 1-click identity verification (KYC) to activate your SubSplit wallet and access shared passes."
            );
        } catch (Exception ignored) {}

        String accessToken = jwtService.generateAccessToken(savedUser);
        String refreshToken = jwtService.generateRefreshToken(savedUser);

        return new AuthResponse(accessToken, refreshToken);
    }


    @Override
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return new AuthResponse(accessToken, refreshToken);
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {

        String username = jwtService.extractUsername(request.getRefreshToken());

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        if (!jwtService.isTokenValid(request.getRefreshToken(), user)) {
            throw new UnauthorizedException("Invalid refresh token.");
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return new AuthResponse(accessToken, refreshToken);
    }
}
