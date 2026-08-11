package com.subsplit.message.controller;

import com.subsplit.common.dto.ApiResponse;
import com.subsplit.common.entity.User;
import com.subsplit.message.dto.ConversationDto;
import com.subsplit.message.dto.MessageDto;
import com.subsplit.message.dto.SendMessageRequest;
import com.subsplit.message.service.MessageService;
import com.subsplit.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final UserRepository userRepository;

    private User getAuthenticatedUserOptional(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return null;
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationDto>>> getUserConversations(Authentication authentication) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        List<ConversationDto> convs = messageService.getUserConversations(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Conversations retrieved successfully", convs));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<ApiResponse<ConversationDto>> getConversationById(
            Authentication authentication,
            @PathVariable Long id) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        ConversationDto conv = messageService.getConversationById(currentUser, id);
        return ResponseEntity.ok(ApiResponse.success("Conversation retrieved successfully", conv));
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<ApiResponse<List<MessageDto>>> getConversationMessages(
            Authentication authentication,
            @PathVariable Long id) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        List<MessageDto> messages = messageService.getConversationMessages(currentUser, id);
        return ResponseEntity.ok(ApiResponse.success("Messages retrieved successfully", messages));
    }

    @PostMapping("/conversations/start")
    public ResponseEntity<ApiResponse<ConversationDto>> startOrGetConversation(
            Authentication authentication,
            @RequestParam Long recipientId,
            @RequestParam(required = false) Long listingId) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        ConversationDto conv = messageService.startOrGetConversation(currentUser, recipientId, listingId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Conversation started successfully", conv));
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<MessageDto>> sendMessage(
            Authentication authentication,
            @Valid @RequestBody SendMessageRequest request) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        MessageDto response = messageService.sendMessage(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Message sent successfully", response));
    }

    @PutMapping("/conversations/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markConversationAsRead(
            Authentication authentication,
            @PathVariable Long id) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        messageService.markConversationAsRead(currentUser, id);
        return ResponseEntity.ok(ApiResponse.success("Conversation marked as read", null));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(Authentication authentication) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        long unread = messageService.getUnreadCount(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Unread count fetched successfully", Map.of("unreadCount", unread)));
    }
}
