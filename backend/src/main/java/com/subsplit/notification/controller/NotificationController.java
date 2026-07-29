package com.subsplit.notification.controller;

import com.subsplit.common.dto.ApiResponse;
import com.subsplit.common.entity.User;
import com.subsplit.user.repository.UserRepository;

import com.subsplit.notification.dto.NotificationResponseDto;
import com.subsplit.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor

public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponseDto>>> getUserNotifications(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<NotificationResponseDto> notifications = notificationService.getUserNotifications(user);
        return ResponseEntity.ok(ApiResponse.success("Notifications fetched successfully", notifications));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(Authentication authentication) {
        User user = getCurrentUser(authentication);
        long count = notificationService.getUnreadCount(user);
        return ResponseEntity.ok(ApiResponse.success("Unread count fetched successfully", Map.of("count", count)));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponseDto>> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {
        User user = getCurrentUser(authentication);
        NotificationResponseDto notification = notificationService.markAsRead(user, id);
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", notification));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(Authentication authentication) {
        User user = getCurrentUser(authentication);
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable Long id,
            Authentication authentication) {
        User user = getCurrentUser(authentication);
        notificationService.deleteNotification(user, id);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted successfully", null));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearAllNotifications(Authentication authentication) {
        User user = getCurrentUser(authentication);
        notificationService.clearAllNotifications(user);
        return ResponseEntity.ok(ApiResponse.success("All notifications cleared successfully", null));
    }
}
