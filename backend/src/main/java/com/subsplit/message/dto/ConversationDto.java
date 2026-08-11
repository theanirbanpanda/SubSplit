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
public class ConversationDto {
    private Long id;
    private Long otherUserId;
    private String otherUserName;
    private String otherUserAvatar;
    private String otherUserInitials;
    private String otherUserEmail;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    private Integer unreadCount;
    private Long listingId;
    private String listingTitle;
    private String platform;
    private Boolean isNonE2EEMonitored;
}
