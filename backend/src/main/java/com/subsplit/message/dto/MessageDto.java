package com.subsplit.message.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private Long id;
    private Long conversationId;
    private Long senderId;
    private String senderName;
    private String senderAvatar;
    private String senderInitials;
    private Long receiverId;
    private String receiverName;
    private String content;
    private Boolean isRead;
    private Boolean isMine;
    private LocalDateTime createdAt;
}
