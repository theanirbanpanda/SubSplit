package com.subsplit.notification.service;

import com.subsplit.common.entity.User;
import com.subsplit.common.enums.NotificationType;
import com.subsplit.notification.dto.NotificationResponseDto;
import com.subsplit.notification.entity.Notification;

import java.util.List;

public interface NotificationService {

    List<NotificationResponseDto> getUserNotifications(User user);

    long getUnreadCount(User user);

    NotificationResponseDto markAsRead(User user, Long notificationId);

    void markAllAsRead(User user);

    void deleteNotification(User user, Long notificationId);

    void clearAllNotifications(User user);

    Notification createNotification(User user, NotificationType type, String title, String message);

}
