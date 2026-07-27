package com.subsplit.user.service.impl;

import com.subsplit.auth.dto.UserResponse;
import com.subsplit.common.entity.User;
import com.subsplit.common.exception.ResourceNotFoundException;
import com.subsplit.user.dto.UpdateProfileRequest;
import com.subsplit.user.repository.UserRepository;
import com.subsplit.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public UserResponse uploadProfileImage(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file cannot be empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        try {
            Path uploadDir = Paths.get("./uploads/profiles");
            File dir = uploadDir.toFile();
            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalFilename = file.getOriginalFilename();
            String extension = ".png";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String filename = "profile_" + userId + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
            Path filePath = uploadDir.resolve(filename);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "/uploads/profiles/" + filename;
            user.setProfileImage(imageUrl);
            User savedUser = userRepository.save(user);

            return UserResponse.fromUser(savedUser);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store profile image: " + e.getMessage(), e);
        }
    }

    @Override
    public UserResponse updateProfileImageBase64(Long userId, String imageBase64) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (imageBase64 == null || imageBase64.isBlank()) {
            throw new IllegalArgumentException("Profile image data cannot be empty");
        }

        user.setProfileImage(imageBase64);
        User savedUser = userRepository.save(user);
        return UserResponse.fromUser(savedUser);
    }

    @Override
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        com.subsplit.common.entity.UserProfile profile = user.getProfile();
        if (profile == null) {
            profile = com.subsplit.common.entity.UserProfile.builder().user(user).build();
            user.setProfile(profile);
        }

        if (request != null) {
            if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
                user.setFirstName(request.getFirstName().trim());
            }
            if (request.getLastName() != null && !request.getLastName().isBlank()) {
                user.setLastName(request.getLastName().trim());
            }
            if (request.getPhone() != null) {
                profile.setPhone(request.getPhone().trim());
            }
            if (request.getState() != null) {
                profile.setState(request.getState().trim());
            }
            if (request.getCity() != null) {
                profile.setCity(request.getCity().trim());
            }
            if (request.getBio() != null) {
                profile.setBio(request.getBio().trim());
            }
        }

        User savedUser = userRepository.save(user);
        return UserResponse.fromUser(savedUser);
    }
}
