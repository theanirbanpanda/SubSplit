package com.subsplit.notification.dto;

import com.subsplit.common.enums.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponseDto {

    private Long id;
    private NotificationType notificationType;
    private String title;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;

}
