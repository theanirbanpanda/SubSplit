package com.subsplit.user.service.impl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.subsplit.role.entity.Role;
import com.subsplit.role.repository.RoleRepository;
import com.subsplit.user.dto.UserCreationRequest;
import com.subsplit.user.entity.User;
import com.subsplit.user.repository.UserRepository;
import com.subsplit.user.service.UserService;

import lombok.RequiredArgsConstructor;

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
        if (request.getPhone() != null && !request.getPhone().isBlank() && userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Phone number already exists");
        }

        Role role = null;
        if (request.getRoleName() != null && !request.getRoleName().isBlank()) {
            role = roleRepository.findByRoleName(request.getRoleName())
                    .orElseGet(() -> roleRepository.save(Role.builder().roleName(request.getRoleName()).build()));
        } else {
            role = roleRepository.findByRoleName("USER")
                    .orElseGet(() -> roleRepository.save(Role.builder().roleName("USER").build()));
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .profileImage(request.getProfileImage())
                .active(true)
                .emailVerified(false)
                .build();

        return userRepository.save(user);
    }
}
