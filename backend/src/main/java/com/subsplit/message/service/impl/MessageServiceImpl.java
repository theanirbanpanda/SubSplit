package com.subsplit.message.service.impl;

import com.subsplit.common.entity.User;
import com.subsplit.common.enums.NotificationType;
import com.subsplit.common.exception.BadRequestException;
import com.subsplit.common.exception.ResourceNotFoundException;
import com.subsplit.common.exception.UnauthorizedException;
import com.subsplit.listing.entity.Listing;
import com.subsplit.listing.repository.ListingRepository;
import com.subsplit.message.dto.ConversationDto;
import com.subsplit.message.dto.MessageDto;
import com.subsplit.message.dto.SendMessageRequest;
import com.subsplit.message.entity.Conversation;
import com.subsplit.message.entity.Message;
import com.subsplit.message.entity.MessageReaction;
import com.subsplit.message.repository.ConversationRepository;
import com.subsplit.message.repository.MessageReactionRepository;
import com.subsplit.message.repository.MessageRepository;
import com.subsplit.message.service.MessageService;
import com.subsplit.notification.service.NotificationService;
import com.subsplit.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final MessageReactionRepository reactionRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final ListingRepository listingRepository;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Value("${app.upload.dir:uploads/messages}")
    private String uploadDir;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Override
    @Transactional(readOnly = true)
    public List<ConversationDto> getUserConversations(User currentUser) {
        if (currentUser == null) return Collections.emptyList();
        return conversationRepository.findUserConversations(currentUser.getId())
                .stream()
                .map(c -> mapToConversationDto(c, currentUser))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ConversationDto getConversationById(User currentUser, Long conversationId) {
        if (currentUser == null) throw new UnauthorizedException("Not authenticated");
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
        return mapToConversationDto(conv, currentUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDto> getConversationMessages(User currentUser, Long conversationId) {
        if (currentUser == null) return Collections.emptyList();
        List<Message> msgs = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        List<Long> msgIds = msgs.stream().map(Message::getId).collect(Collectors.toList());

        // Bulk load reactions
        Map<Long, Map<String, Long>> reactionsMap = new HashMap<>();
        if (!msgIds.isEmpty()) {
            List<Object[]> rows = reactionRepository.countReactionsByMessageIds(msgIds);
            for (Object[] row : rows) {
                Long mId = ((Number) row[0]).longValue();
                String emoji = (String) row[1];
                Long count = ((Number) row[2]).longValue();
                reactionsMap.computeIfAbsent(mId, k -> new LinkedHashMap<>()).put(emoji, count);
            }
        }

        return msgs.stream()
                .map(m -> mapToMessageDto(m, currentUser, reactionsMap.getOrDefault(m.getId(), Collections.emptyMap())))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ConversationDto startOrGetConversation(User currentUser, Long recipientId, Long listingId) {
        if (currentUser == null) throw new UnauthorizedException("Not authenticated");
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found"));

        // Always prefer any existing 1-to-1 conversation between these two users,
        // regardless of listing. This prevents duplicate threads for the same host.
        List<Conversation> existing = conversationRepository.findBetweenUsers(currentUser.getId(), recipientId);

        Conversation conv;
        if (!existing.isEmpty()) {
            conv = existing.get(0);
            // Update listing context if not already set and a listing was provided
            if (conv.getListing() == null && listingId != null) {
                listingRepository.findById(listingId).ifPresent(conv::setListing);
                conversationRepository.save(conv);
            }
        } else {
            Listing listing = listingId != null ? listingRepository.findById(listingId).orElse(null) : null;
            conv = Conversation.builder()
                    .participant1(currentUser)
                    .participant2(recipient)
                    .listing(listing)
                    .unreadCountUser1(0)
                    .unreadCountUser2(0)
                    .build();
            conv = conversationRepository.save(conv);
        }
        return mapToConversationDto(conv, currentUser);
    }

    @Override
    @Transactional
    public MessageDto sendMessage(User currentUser, SendMessageRequest request) {
        if (currentUser == null) throw new UnauthorizedException("Not authenticated");

        Conversation conv;
        User recipient;

        if (request.getConversationId() != null) {
            conv = conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
            if (!Objects.equals(conv.getParticipant1().getId(), currentUser.getId()) &&
                    !Objects.equals(conv.getParticipant2().getId(), currentUser.getId())) {
                throw new UnauthorizedException("You are not a participant in this conversation");
            }
            recipient = Objects.equals(conv.getParticipant1().getId(), currentUser.getId())
                    ? conv.getParticipant2() : conv.getParticipant1();
        } else if (request.getRecipientId() != null) {
            recipient = userRepository.findById(request.getRecipientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Recipient not found"));
            List<Conversation> existing = conversationRepository.findBetweenUsers(currentUser.getId(), request.getRecipientId());
            Listing listing = request.getListingId() != null ? listingRepository.findById(request.getListingId()).orElse(null) : null;
            if (!existing.isEmpty()) {
                conv = existing.get(0);
            } else {
                conv = Conversation.builder()
                        .participant1(currentUser).participant2(recipient).listing(listing)
                        .unreadCountUser1(0).unreadCountUser2(0).build();
                conv = conversationRepository.save(conv);
            }
        } else {
            throw new BadRequestException("Either conversationId or recipientId must be provided");
        }

        // Determine message type
        Message.MessageType msgType = Message.MessageType.TEXT;
        if ("IMAGE".equals(request.getMessageType())) msgType = Message.MessageType.IMAGE;
        else if ("FILE".equals(request.getMessageType())) msgType = Message.MessageType.FILE;

        String plainText = request.getContent() != null ? request.getContent().trim() : "";
        if (plainText.isEmpty() && msgType == Message.MessageType.TEXT) {
            throw new BadRequestException("Message content cannot be empty");
        }
        if (plainText.isEmpty()) plainText = request.getAttachmentName() != null ? request.getAttachmentName() : "Attachment";

        // ReplyTo
        Message replyTo = null;
        if (request.getReplyToId() != null) {
            replyTo = messageRepository.findById(request.getReplyToId()).orElse(null);
        }

        Message msg = Message.builder()
                .conversation(conv)
                .sender(currentUser)
                .receiver(recipient)
                .content(plainText)
                .isRead(false)
                .messageType(msgType)
                .attachmentUrl(request.getAttachmentUrl())
                .attachmentName(request.getAttachmentName())
                .isDeleted(false)
                .replyTo(replyTo)
                .build();

        Message saved = messageRepository.save(msg);

        // Update conversation summary
        String preview = msgType == Message.MessageType.IMAGE ? " Image"
                : msgType == Message.MessageType.FILE ? " " + request.getAttachmentName()
                : (plainText.length() > 60 ? plainText.substring(0, 57) + "..." : plainText);
        conv.setLastMessage(preview);
        conv.setLastMessageAt(LocalDateTime.now());
        if (Objects.equals(conv.getParticipant1().getId(), currentUser.getId())) {
            conv.setUnreadCountUser2((conv.getUnreadCountUser2() != null ? conv.getUnreadCountUser2() : 0) + 1);
        } else {
            conv.setUnreadCountUser1((conv.getUnreadCountUser1() != null ? conv.getUnreadCountUser1() : 0) + 1);
        }
        conversationRepository.save(conv);

        // Notification
        try {
            notificationService.createNotification(recipient, NotificationType.SYSTEM,
                    "New Message from " + getUserDisplayName(currentUser) + " ", preview);
        } catch (Exception e) {
            log.error("Failed to send message notification: ", e);
        }

        // WebSocket broadcast to receiver
        try {
            MessageDto receiverDto = mapToMessageDto(saved, recipient, Collections.emptyMap());
            simpMessagingTemplate.convertAndSendToUser(recipient.getEmail(), "/queue/messages", receiverDto);
        } catch (Exception e) {
            log.error("Failed to broadcast message: ", e);
        }

        return mapToMessageDto(saved, currentUser, Collections.emptyMap());
    }

    @Override
    @Transactional
    public void markConversationAsRead(User currentUser, Long conversationId) {
        if (currentUser == null) return;
        messageRepository.markMessagesAsRead(conversationId, currentUser.getId());
        conversationRepository.findById(conversationId).ifPresent(c -> {
            if (Objects.equals(c.getParticipant1().getId(), currentUser.getId())) {
                c.setUnreadCountUser1(0);
            } else {
                c.setUnreadCountUser2(0);
            }
            conversationRepository.save(c);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(User currentUser) {
        if (currentUser == null) return 0L;
        return messageRepository.countUnreadMessagesByReceiverId(currentUser.getId());
    }

    @Override
    @Transactional
    public Map<String, Object> reactToMessage(User currentUser, Long messageId, String emoji) {
        if (currentUser == null) throw new UnauthorizedException("Not authenticated");
        Message msg = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));

        Optional<MessageReaction> existing = reactionRepository.findByMessageIdAndUserIdAndEmoji(messageId, currentUser.getId(), emoji);
        boolean added;
        if (existing.isPresent()) {
            reactionRepository.delete(existing.get());
            added = false;
        } else {
            MessageReaction reaction = MessageReaction.builder()
                    .message(msg).user(currentUser).emoji(emoji).build();
            reactionRepository.save(reaction);
            added = true;
        }

        // Build updated counts
        List<Object[]> rows = reactionRepository.countReactionsByMessageId(messageId);
        Map<String, Long> counts = new LinkedHashMap<>();
        for (Object[] row : rows) counts.put((String) row[0], ((Number) row[1]).longValue());

        // Broadcast reaction update over WS to the other participant
        try {
            Conversation conv = msg.getConversation();
            User other = Objects.equals(conv.getParticipant1().getId(), currentUser.getId())
                    ? conv.getParticipant2() : conv.getParticipant1();
            Map<String, Object> update = Map.of("messageId", messageId, "reactions", counts);
            simpMessagingTemplate.convertAndSendToUser(other.getEmail(), "/queue/reactions", update);
        } catch (Exception e) {
            log.error("Failed to broadcast reaction: ", e);
        }

        return Map.of("messageId", messageId, "reactions", counts, "added", added);
    }

    @Override
    @Transactional
    public MessageDto deleteMessage(User currentUser, Long messageId) {
        if (currentUser == null) throw new UnauthorizedException("Not authenticated");
        Message msg = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));
        if (!Objects.equals(msg.getSender().getId(), currentUser.getId())) {
            throw new UnauthorizedException("You can only delete your own messages");
        }
        msg.setIsDeleted(true);
        msg.setContent("This message was deleted");
        msg.setAttachmentUrl(null);
        msg.setAttachmentName(null);
        messageRepository.save(msg);

        // Broadcast deletion
        try {
            Conversation conv = msg.getConversation();
            User other = Objects.equals(conv.getParticipant1().getId(), currentUser.getId())
                    ? conv.getParticipant2() : conv.getParticipant1();
            Map<String, Object> evt = Map.of("messageId", messageId, "deleted", true);
            simpMessagingTemplate.convertAndSendToUser(other.getEmail(), "/queue/messages", evt);
        } catch (Exception e) {
            log.error("Failed to broadcast delete: ", e);
        }

        return mapToMessageDto(msg, currentUser, Collections.emptyMap());
    }

    @Override
    public String uploadAttachment(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new BadRequestException("File is empty");
        try {
            Path dir = Paths.get(uploadDir);
            Files.createDirectories(dir);
            String originalName = Objects.requireNonNull(file.getOriginalFilename()).replaceAll("[^a-zA-Z0-9._-]", "_");
            String filename = System.currentTimeMillis() + "_" + originalName;
            Path dest = dir.resolve(filename);
            file.transferTo(dest);
            return baseUrl + "/api/v1/messages/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }

    //  Mappers 

    private ConversationDto mapToConversationDto(Conversation conv, User currentUser) {
        User other = Objects.equals(conv.getParticipant1().getId(), currentUser.getId())
                ? conv.getParticipant2() : conv.getParticipant1();
        Integer unread = Objects.equals(conv.getParticipant1().getId(), currentUser.getId())
                ? conv.getUnreadCountUser1() : conv.getUnreadCountUser2();
        String otherName = getUserDisplayName(other);
        Listing listing = conv.getListing();
        return ConversationDto.builder()
                .id(conv.getId())
                .otherUserId(other.getId())
                .otherUserName(otherName)
                .otherUserAvatar(other.getProfileImage())
                .otherUserInitials(getInitials(otherName))
                .otherUserEmail(other.getEmail())
                .lastMessage(conv.getLastMessage())
                .lastMessageAt(conv.getLastMessageAt() != null ? conv.getLastMessageAt() : conv.getCreatedAt())
                .unreadCount(unread != null ? unread : 0)
                .listingId(listing != null ? listing.getId() : null)
                .listingTitle(listing != null ? listing.getTitle() : "Direct Support Chat")
                .platform(listing != null && listing.getPlan() != null && listing.getPlan().getSubscription() != null
                        ? listing.getPlan().getSubscription().getProviderName() : "SubSplit")
                .isNonE2EEMonitored(true)
                .build();
    }

    private MessageDto mapToMessageDto(Message msg, User currentUser, Map<String, Long> reactions) {
        boolean isMine = Objects.equals(msg.getSender().getId(), currentUser.getId());
        String senderName = getUserDisplayName(msg.getSender());
        String receiverName = getUserDisplayName(msg.getReceiver());
        String replyContent = null;
        String replySenderName = null;
        Long replyToId = null;
        if (msg.getReplyTo() != null) {
            replyToId = msg.getReplyTo().getId();
            replyContent = msg.getReplyTo().getIsDeleted() != null && msg.getReplyTo().getIsDeleted()
                    ? "Message deleted" : msg.getReplyTo().getContent();
            replySenderName = getUserDisplayName(msg.getReplyTo().getSender());
        }
        return MessageDto.builder()
                .id(msg.getId())
                .conversationId(msg.getConversation().getId())
                .senderId(msg.getSender().getId())
                .senderName(senderName)
                .senderAvatar(msg.getSender().getProfileImage())
                .senderInitials(getInitials(senderName))
                .receiverId(msg.getReceiver().getId())
                .receiverName(receiverName)
                .content(msg.getContent())
                .isRead(msg.getIsRead())
                .isMine(isMine)
                .createdAt(msg.getCreatedAt())
                .messageType(msg.getMessageType() != null ? msg.getMessageType().name() : "TEXT")
                .attachmentUrl(msg.getAttachmentUrl())
                .attachmentName(msg.getAttachmentName())
                .isDeleted(msg.getIsDeleted())
                .replyToId(replyToId)
                .replyToContent(replyContent)
                .replyToSenderName(replySenderName)
                .reactions(reactions.isEmpty() ? null : reactions)
                .iReacted(false)
                .build();
    }

    private String getUserDisplayName(User user) {
        if (user == null) return "Member";
        String name = user.getFullName();
        if (name == null || name.isBlank() || name.equalsIgnoreCase("null null") || name.equalsIgnoreCase("null")) {
            return user.getUsername() != null && !user.getUsername().isBlank()
                    ? user.getUsername() : (user.getEmail() != null ? user.getEmail().split("@")[0] : "Member");
        }
        return name;
    }

    private String getInitials(String name) {
        if (name == null || name.isBlank()) return "M";
        String[] parts = name.trim().split("\\s+");
        if (parts.length >= 2) return (parts[0].substring(0, 1) + parts[1].substring(0, 1)).toUpperCase();
        return name.substring(0, Math.min(2, name.length())).toUpperCase();
    }
}
