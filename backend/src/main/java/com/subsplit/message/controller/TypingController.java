package com.subsplit.message.controller;

import com.subsplit.common.entity.User;
import com.subsplit.message.dto.TypingEvent;
import com.subsplit.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class TypingController {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    @MessageMapping("/typing")
    public void handleTyping(TypingEvent event, Authentication auth) {
        if (auth == null) return;
        try {
            User sender = userRepository.findByEmail(auth.getName()).orElse(null);
            if (sender == null) return;
            event.setSenderId(sender.getId());
            event.setSenderName(sender.getFullName() != null ? sender.getFullName() : sender.getEmail().split("@")[0]);
            // We need to broadcast to the other user in the conversation.
            // The client should include recipientEmail in event, but for now we broadcast on a topic
            messagingTemplate.convertAndSend("/topic/typing/" + event.getConversationId(), event);
        } catch (Exception e) {
            // ignore
        }
    }
}
