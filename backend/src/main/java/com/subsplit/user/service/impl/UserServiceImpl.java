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

import com.subsplit.notification.service.NotificationService;
import com.subsplit.common.enums.NotificationType;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final NotificationService notificationService;
    private final com.subsplit.user.service.AiKycVerificationService aiKycVerificationService;

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

        String rawStatus = user.getKycStatus();
        boolean isVerified = Boolean.TRUE.equals(user.getEmailVerified()) || "VERIFIED".equalsIgnoreCase(rawStatus);
        boolean isVerifying = "VERIFYING".equalsIgnoreCase(rawStatus) || "IN_PROGRESS".equalsIgnoreCase(rawStatus);

        String status = isVerified ? "VERIFIED" : (isVerifying ? "VERIFYING" : "PENDING");
        String docLabel = (user.getKycDocumentType() != null && !user.getKycDocumentType().isBlank())
                ? user.getKycDocumentType()
                : (isVerified ? "Govt ID Verified" : "Identity Document Needed");

        String message;
        if (isVerified) {
            message = "Your KYC verification is complete. You have full access to wallet, escrow transactions, and group hosting.";
        } else if (isVerifying) {
            message = "SubSplit AI is analyzing your uploaded identity document. Please wait a moment...";
        } else {
            message = "Your KYC verification is pending. Please verify your identity to access your wallet and join or host subscription groups.";
        }

        return com.subsplit.user.dto.KycStatusResponse.builder()
                .userId(userId)
                .isKycVerified(isVerified)
                .kycStatus(status)
                .documentType(docLabel)
                .message(message)
                .verifiedAt(isVerified ? (user.getCreatedAt() != null ? user.getCreatedAt() : java.time.LocalDateTime.now()) : null)
                .build();
    }

    @Override
    public com.subsplit.user.dto.KycStatusResponse submitKycDocument(Long userId, MultipartFile file, String documentType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if ("VERIFYING".equalsIgnoreCase(user.getKycStatus()) || "IN_PROGRESS".equalsIgnoreCase(user.getKycStatus())) {
            throw new IllegalArgumentException("AI verification is already in progress for your identity document. Please wait until it completes.");
        }

        String docLabel = (documentType != null && !documentType.isBlank()) ? documentType : "Govt ID";

        user.setKycStatus("VERIFYING");
        user.setKycDocumentType(docLabel);
        user.setEmailVerified(false);
        userRepository.save(user);

        byte[] fileBytes = null;
        String originalFilename = null;
        String contentType = null;

        if (file != null && !file.isEmpty()) {
            try {
                fileBytes = file.getBytes();
                originalFilename = file.getOriginalFilename();
                contentType = file.getContentType();
            } catch (IOException e) {
                fileBytes = new byte[0];
            }
        } else {
            // Simulated upload payload for quick verification
            fileBytes = "DEMO_GOVT_ID_DOCUMENT_BYTES".getBytes();
            originalFilename = docLabel.toLowerCase().replace(" ", "_") + ".png";
            contentType = "image/png";
        }

        // Trigger async AI verification
        aiKycVerificationService.verifyDocumentAsync(userId, docLabel, fileBytes, originalFilename, contentType);

        return com.subsplit.user.dto.KycStatusResponse.builder()
                .userId(userId)
                .isKycVerified(false)
                .kycStatus("VERIFYING")
                .documentType(docLabel)
                .message("SubSplit AI is currently verifying your " + docLabel + ". You will be notified once complete.")
                .verifiedAt(null)
                .build();
    }
}



