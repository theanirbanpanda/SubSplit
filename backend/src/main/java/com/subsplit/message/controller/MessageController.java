package com.subsplit.message.controller;

import com.subsplit.common.dto.ApiResponse;
import com.subsplit.common.entity.User;
import com.subsplit.message.dto.*;
import com.subsplit.message.service.MessageService;
import com.subsplit.user.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final UserRepository userRepository;

    private User getUser(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) return null;
        return userRepository.findByEmail(auth.getName())
                .orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationDto>>> getUserConversations(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Conversations retrieved", messageService.getUserConversations(getUser(auth))));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<ApiResponse<ConversationDto>> getConversationById(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Conversation retrieved", messageService.getConversationById(getUser(auth), id)));
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<ApiResponse<List<MessageDto>>> getConversationMessages(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Messages retrieved", messageService.getConversationMessages(getUser(auth), id)));
    }

    @PostMapping("/conversations/start")
    public ResponseEntity<ApiResponse<ConversationDto>> startOrGetConversation(
            Authentication auth,
            @RequestParam Long recipientId,
            @RequestParam(required = false) Long listingId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Conversation started", messageService.startOrGetConversation(getUser(auth), recipientId, listingId)));
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<MessageDto>> sendMessage(Authentication auth, @RequestBody SendMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Message sent", messageService.sendMessage(getUser(auth), request)));
    }

    @PutMapping("/conversations/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(Authentication auth, @PathVariable Long id) {
        messageService.markConversationAsRead(getUser(auth), id);
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(Authentication auth) {
        long unread = messageService.getUnreadCount(getUser(auth));
        return ResponseEntity.ok(ApiResponse.success("Unread count fetched", Map.of("unreadCount", unread)));
    }

    @PostMapping("/{messageId}/react")
    public ResponseEntity<ApiResponse<Map<String, Object>>> reactToMessage(
            Authentication auth,
            @PathVariable Long messageId,
            @RequestBody @Valid ReactMessageRequest request) {
        request.setMessageId(messageId);
        Map<String, Object> result = messageService.reactToMessage(getUser(auth), messageId, request.getEmoji());
        return ResponseEntity.ok(ApiResponse.success("Reaction toggled", result));
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse<MessageDto>> deleteMessage(Authentication auth, @PathVariable Long messageId) {
        MessageDto result = messageService.deleteMessage(getUser(auth), messageId);
        return ResponseEntity.ok(ApiResponse.success("Message deleted", result));
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadAttachment(
            Authentication auth,
            @RequestParam("file") MultipartFile file) {
        String url = messageService.uploadAttachment(file);
        return ResponseEntity.ok(ApiResponse.success("File uploaded", Map.of("url", url, "name", file.getOriginalFilename() != null ? file.getOriginalFilename() : "file")));
    }

    @GetMapping("/uploads/{filename}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = Paths.get("uploads/messages").resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
            String contentType = "application/octet-stream";
            String lc = filename.toLowerCase();
            if (lc.endsWith(".jpg") || lc.endsWith(".jpeg")) contentType = "image/jpeg";
            else if (lc.endsWith(".png")) contentType = "image/png";
            else if (lc.endsWith(".gif")) contentType = "image/gif";
            else if (lc.endsWith(".webp")) contentType = "image/webp";
            else if (lc.endsWith(".pdf")) contentType = "application/pdf";
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
