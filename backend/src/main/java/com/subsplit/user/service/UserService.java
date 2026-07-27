package com.subsplit.user.service;

import com.subsplit.auth.dto.UserResponse;
import com.subsplit.common.entity.User;
import com.subsplit.user.dto.UpdateProfileRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {

    List<User> getAllUsers();

    UserResponse uploadProfileImage(Long userId, MultipartFile file);

    UserResponse updateProfileImageBase64(Long userId, String imageBase64);

    UserResponse updateProfile(Long userId, UpdateProfileRequest request);
}
