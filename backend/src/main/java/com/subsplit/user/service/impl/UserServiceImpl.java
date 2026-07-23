package com.subsplit.user.service.impl;

import com.subsplit.common.entity.Role;
import com.subsplit.common.entity.User;
import com.subsplit.user.dto.UserCreationRequest;
import com.subsplit.user.repository.RoleRepository;
import com.subsplit.user.repository.UserRepository;
import com.subsplit.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User createUser(UserCreationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        String roleName = (request.getRoleName() != null && !request.getRoleName().isBlank())
                ? request.getRoleName()
                : "USER";

        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(Role.builder().name(roleName).build()));

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .profileImage(request.getProfileImage())
                .isActive(true)
                .emailVerified(false)
                .build();

        return userRepository.save(user);
    }
}
