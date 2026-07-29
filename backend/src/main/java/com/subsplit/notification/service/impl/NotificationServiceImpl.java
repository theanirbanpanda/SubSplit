package com.subsplit.notification.service.impl;

import com.subsplit.common.entity.User;
import com.subsplit.common.enums.NotificationType;
import com.subsplit.notification.dto.NotificationResponseDto;
import com.subsplit.notification.entity.Notification;
import com.subsplit.notification.repository.NotificationRepository;
import com.subsplit.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public List<NotificationResponseDto> getUserNotifications(User user) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        if (notifications.isEmpty()) {
            // Seed initial notifications for a fresh experience
            seedInitialNotifications(user);
            notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        }

        return notifications.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public long getUnreadCount(User user) {
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Override
    @Transactional
    public NotificationResponseDto markAsRead(User user, Long notificationId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, user.getId())
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        Notification saved = notificationRepository.save(notification);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        for (Notification n : notifications) {
            if (!n.getIsRead()) {
                n.setIsRead(true);
            }
        }
        notificationRepository.saveAll(notifications);
    }

    @Override
    @Transactional
    public void deleteNotification(User user, Long notificationId) {
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, user.getId())
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notificationRepository.delete(notification);
    }

    @Override
    @Transactional
    public void clearAllNotifications(User user) {
        notificationRepository.deleteByUserId(user.getId());
    }

    @Override
    @Transactional
    public Notification createNotification(User user, NotificationType type, String title, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .notificationType(type)
                .title(title)
                .message(message)
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    private void seedInitialNotifications(User user) {
        Notification n1 = Notification.builder()
                .user(user)
                .notificationType(NotificationType.SYSTEM)
                .title("Welcome to SubSplit! 🎉")
                .message("Your account setup is complete. Explore subscription group passes or list your own slot.")
                .isRead(false)
                .build();

        Notification n2 = Notification.builder()
                .user(user)
                .notificationType(NotificationType.ESCROW)
                .title("Escrow Protection Activated")
                .message("All group membership payments on SubSplit are secured in escrow until credentials are confirmed.")
                .isRead(false)
                .build();

        notificationRepository.saveAll(List.of(n1, n2));
    }

    private NotificationResponseDto mapToDto(Notification notification) {
        return NotificationResponseDto.builder()
                .id(notification.getId())
                .notificationType(notification.getNotificationType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
