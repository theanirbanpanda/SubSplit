package com.subsplit.notification.service.impl;

import com.subsplit.notification.entity.Notification;
import com.subsplit.notification.repository.NotificationRepository;
import com.subsplit.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}
