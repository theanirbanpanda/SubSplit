package com.subsplit.user.controller;

import com.subsplit.auth.dto.UserResponse;
import com.subsplit.common.dto.ApiResponse;
import com.subsplit.common.entity.User;
import com.subsplit.common.exception.UnauthorizedException;
import com.subsplit.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/profile-image")
    public ResponseEntity<ApiResponse<UserResponse>> uploadProfileImage(
            Authentication authentication,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestBody(required = false) Map<String, String> body) {

        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            throw new UnauthorizedException("User is not authenticated");
        }

        UserResponse response;
        if (file != null && !file.isEmpty()) {
            response = userService.uploadProfileImage(user.getId(), file);
        } else if (body != null && (body.containsKey("profileImage") || body.containsKey("imageBase64"))) {
            String imgData = body.getOrDefault("profileImage", body.get("imageBase64"));
            response = userService.updateProfileImageBase64(user.getId(), imgData);
        } else {
            throw new IllegalArgumentException("No file or profile image data provided");
        }

        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("Profile picture updated successfully")
                        .data(response)
                        .build());
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            Authentication authentication,
            @RequestBody com.subsplit.user.dto.UpdateProfileRequest request) {

        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            throw new UnauthorizedException("User is not authenticated");
        }

        UserResponse response = userService.updateProfile(user.getId(), request);

        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("Profile details updated successfully")
                        .data(response)
                        .build());
    }
}
