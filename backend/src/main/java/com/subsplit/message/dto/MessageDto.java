package com.subsplit.message.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

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
    // New fields
    private String messageType;   // TEXT, IMAGE, FILE
    private String attachmentUrl;
    private String attachmentName;
    private Boolean isDeleted;
    private Long replyToId;
    private String replyToContent;
    private String replyToSenderName;
    private Map<String, Long> reactions; // emoji -> count
    private Boolean iReacted; // did current user react (any emoji)
}
