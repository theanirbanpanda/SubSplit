package com.subsplit.message.service;

import com.subsplit.common.entity.User;
import com.subsplit.message.dto.ConversationDto;
import com.subsplit.message.dto.MessageDto;
import com.subsplit.message.dto.SendMessageRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface MessageService {

    List<ConversationDto> getUserConversations(User currentUser);

    ConversationDto getConversationById(User currentUser, Long conversationId);

    List<MessageDto> getConversationMessages(User currentUser, Long conversationId);

    ConversationDto startOrGetConversation(User currentUser, Long recipientId, Long listingId);

    MessageDto sendMessage(User currentUser, SendMessageRequest request);

    void markConversationAsRead(User currentUser, Long conversationId);

    long getUnreadCount(User currentUser);

    // New methods
    Map<String, Object> reactToMessage(User currentUser, Long messageId, String emoji);

    MessageDto deleteMessage(User currentUser, Long messageId);

    String uploadAttachment(MultipartFile file);
}
