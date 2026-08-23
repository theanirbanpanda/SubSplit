package com.subsplit.message.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {

    private Long conversationId;
    private Long recipientId;
    private Long listingId;
    private Long replyToId;

    @Size(max = 2000, message = "Message cannot exceed 2000 characters")
    private String content;

    // messageType: TEXT (default), IMAGE, FILE
    private String messageType;
    private String attachmentUrl;
    private String attachmentName;
}
