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

import com.subsplit.wallet.repository.WalletRepository;
import com.subsplit.wallet.entity.Wallet;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

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

    @Override
    public com.subsplit.user.dto.KycStatusResponse getKycStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isVerified = Boolean.TRUE.equals(user.getEmailVerified());
        String status = isVerified ? "VERIFIED" : "UNVERIFIED";
        String message = isVerified
                ? "Your KYC verification is complete. You have full access to group creation and escrow transactions."
                : "Your KYC verification is pending. Please verify your identity to join or host subscription groups.";

        return com.subsplit.user.dto.KycStatusResponse.builder()
                .userId(userId)
                .isKycVerified(isVerified)
                .kycStatus(status)
                .documentType(isVerified ? "Govt ID Verified" : "Identity Document Needed")
                .message(message)
                .verifiedAt(isVerified ? (user.getCreatedAt() != null ? user.getCreatedAt() : java.time.LocalDateTime.now()) : null)
                .build();
    }

    @Override
    public com.subsplit.user.dto.KycStatusResponse submitKycDocument(Long userId, MultipartFile file, String documentType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setEmailVerified(true);
        User savedUser = userRepository.save(user);

        // Create user wallet in DB upon successful KYC verification if it doesn't exist
        walletRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Wallet newWallet = Wallet.builder()
                            .user(savedUser)
                            .balance(BigDecimal.ZERO)
                            .build();
                    return walletRepository.save(newWallet);
                });

        String docLabel = (documentType != null && !documentType.isBlank()) ? documentType : "Govt ID Verified";

        return com.subsplit.user.dto.KycStatusResponse.builder()
                .userId(userId)
                .isKycVerified(true)
                .kycStatus("VERIFIED")
                .documentType(docLabel)
                .message("Your KYC document has been verified successfully! Wallet has been created for your account.")
                .verifiedAt(java.time.LocalDateTime.now())
                .build();
    }
}



