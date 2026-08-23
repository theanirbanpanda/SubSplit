package com.subsplit.message.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TypingEvent {
    private Long conversationId;
    private Long senderId;
    private String senderName;
    private boolean typing;
}
