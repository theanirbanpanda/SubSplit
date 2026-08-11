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
import com.subsplit.message.repository.ConversationRepository;
import com.subsplit.message.repository.MessageRepository;
import com.subsplit.message.service.MessageService;
import com.subsplit.notification.service.NotificationService;
import com.subsplit.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageServiceImpl implements MessageService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ListingRepository listingRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public List<ConversationDto> getUserConversations(User currentUser) {
        if (currentUser == null) {
            currentUser = userRepository.findAll().stream().findFirst().orElseThrow();
        }

        List<Conversation> convs = conversationRepository.findUserConversations(currentUser.getId());
        User user = currentUser;
        return convs.stream().map(c -> mapToConversationDto(c, user)).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ConversationDto getConversationById(User currentUser, Long conversationId) {
        if (currentUser == null) {
            currentUser = userRepository.findAll().stream().findFirst().orElseThrow();
        }

        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));

        if (!Objects.equals(conv.getParticipant1().getId(), currentUser.getId()) &&
                !Objects.equals(conv.getParticipant2().getId(), currentUser.getId())) {
            throw new UnauthorizedException("You are not a participant in this conversation");
        }

        return mapToConversationDto(conv, currentUser);
    }

    @Override
    @Transactional
    public List<MessageDto> getConversationMessages(User currentUser, Long conversationId) {
        if (currentUser == null) {
            currentUser = userRepository.findAll().stream().findFirst().orElseThrow();
        }

        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));

        if (!Objects.equals(conv.getParticipant1().getId(), currentUser.getId()) &&
                !Objects.equals(conv.getParticipant2().getId(), currentUser.getId())) {
            throw new UnauthorizedException("You are not a participant in this conversation");
        }

        // Mark unread messages as read
        messageRepository.markMessagesAsRead(conversationId, currentUser.getId());
        if (Objects.equals(conv.getParticipant1().getId(), currentUser.getId())) {
            conv.setUnreadCountUser1(0);
        } else {
            conv.setUnreadCountUser2(0);
        }
        conversationRepository.save(conv);

        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId);
        User user = currentUser;
        return messages.stream().map(m -> mapToMessageDto(m, user)).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ConversationDto startOrGetConversation(User currentUser, Long recipientId, Long listingId) {
        if (currentUser == null) {
            currentUser = userRepository.findAll().stream().findFirst().orElseThrow();
        }

        if (Objects.equals(currentUser.getId(), recipientId)) {
            throw new BadRequestException("You cannot start a conversation with yourself");
        }

        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("Recipient user not found with id: " + recipientId));

        Listing listing = listingId != null ? listingRepository.findById(listingId).orElse(null) : null;

        List<Conversation> existing = conversationRepository.findBetweenUsersAndListing(currentUser.getId(), recipientId, listingId);
        if (existing.isEmpty()) {
            existing = conversationRepository.findBetweenUsers(currentUser.getId(), recipientId);
        }

        Conversation conv;
        if (!existing.isEmpty()) {
            conv = existing.get(0);
            if (listing != null && conv.getListing() == null) {
                conv.setListing(listing);
                conv = conversationRepository.save(conv);
            }
        } else {
            conv = Conversation.builder()
                    .participant1(currentUser)
                    .participant2(recipient)
                    .listing(listing)
                    .lastMessage("Conversation started")
                    .lastMessageAt(LocalDateTime.now())
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
        if (currentUser == null) {
            currentUser = userRepository.findAll().stream().findFirst().orElseThrow();
        }

        Conversation conv;
        User recipient;

        if (request.getConversationId() != null) {
            conv = conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + request.getConversationId()));

            if (!Objects.equals(conv.getParticipant1().getId(), currentUser.getId()) &&
                    !Objects.equals(conv.getParticipant2().getId(), currentUser.getId())) {
                throw new UnauthorizedException("You are not a participant in this conversation");
            }

            recipient = Objects.equals(conv.getParticipant1().getId(), currentUser.getId())
                    ? conv.getParticipant2()
                    : conv.getParticipant1();
        } else if (request.getRecipientId() != null) {
            recipient = userRepository.findById(request.getRecipientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Recipient user not found with id: " + request.getRecipientId()));

            List<Conversation> existing = conversationRepository.findBetweenUsersAndListing(
                    currentUser.getId(), request.getRecipientId(), request.getListingId());
            if (existing.isEmpty()) {
                existing = conversationRepository.findBetweenUsers(currentUser.getId(), request.getRecipientId());
            }

            Listing listing = request.getListingId() != null ? listingRepository.findById(request.getListingId()).orElse(null) : null;

            if (!existing.isEmpty()) {
                conv = existing.get(0);
            } else {
                conv = Conversation.builder()
                        .participant1(currentUser)
                        .participant2(recipient)
                        .listing(listing)
                        .unreadCountUser1(0)
                        .unreadCountUser2(0)
                        .build();
                conv = conversationRepository.save(conv);
            }
        } else {
            throw new BadRequestException("Either conversationId or recipientId must be provided");
        }

        String plainText = request.getContent() != null ? request.getContent().trim() : "";
        if (plainText.isEmpty()) {
            throw new BadRequestException("Message content cannot be empty");
        }

        Message msg = Message.builder()
                .conversation(conv)
                .sender(currentUser)
                .receiver(recipient)
                .content(plainText)
                .isRead(false)
                .build();

        Message saved = messageRepository.save(msg);

        // Update conversation summary
        conv.setLastMessage(plainText.length() > 60 ? plainText.substring(0, 57) + "..." : plainText);
        conv.setLastMessageAt(LocalDateTime.now());
        if (Objects.equals(conv.getParticipant1().getId(), currentUser.getId())) {
            conv.setUnreadCountUser2((conv.getUnreadCountUser2() != null ? conv.getUnreadCountUser2() : 0) + 1);
        } else {
            conv.setUnreadCountUser1((conv.getUnreadCountUser1() != null ? conv.getUnreadCountUser1() : 0) + 1);
        }
        conversationRepository.save(conv);

        // Send push notification to receiver
        try {
            String senderName = getUserDisplayName(currentUser);
            notificationService.createNotification(
                    recipient,
                    NotificationType.SYSTEM,
                    "New Message from " + senderName + " 💬",
                    plainText
            );
        } catch (Exception e) {
            log.error("Failed to send message notification: ", e);
        }

        return mapToMessageDto(saved, currentUser);
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

    private ConversationDto mapToConversationDto(Conversation conv, User currentUser) {
        User other = Objects.equals(conv.getParticipant1().getId(), currentUser.getId())
                ? conv.getParticipant2()
                : conv.getParticipant1();

        Integer unread = Objects.equals(conv.getParticipant1().getId(), currentUser.getId())
                ? conv.getUnreadCountUser1()
                : conv.getUnreadCountUser2();

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
                .platform(listing != null && listing.getPlan() != null && listing.getPlan().getSubscription() != null ? listing.getPlan().getSubscription().getProviderName() : "SubSplit")
                .isNonE2EEMonitored(true)
                .build();
    }

    private MessageDto mapToMessageDto(Message msg, User currentUser) {
        boolean isMine = Objects.equals(msg.getSender().getId(), currentUser.getId());
        String senderName = getUserDisplayName(msg.getSender());
        String receiverName = getUserDisplayName(msg.getReceiver());

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
                .build();
    }

    private String getUserDisplayName(User user) {
        if (user == null) return "Member";
        String name = user.getFullName();
        if (name == null || name.isBlank() || name.equalsIgnoreCase("null null") || name.equalsIgnoreCase("null")) {
            return user.getUsername() != null && !user.getUsername().isBlank()
                    ? user.getUsername()
                    : (user.getEmail() != null ? user.getEmail().split("@")[0] : "Member");
        }
        return name;
    }

    private String getInitials(String name) {
        if (name == null || name.isBlank() || name.equalsIgnoreCase("null null") || name.equalsIgnoreCase("null")) {
            return "M";
        }
        String[] parts = name.trim().split("\\s+");
        if (parts.length >= 2 && !parts[0].isEmpty() && !parts[1].isEmpty()) {
            return (parts[0].substring(0, 1) + parts[1].substring(0, 1)).toUpperCase();
        }
        return name.substring(0, Math.min(2, name.length())).toUpperCase();
    }
}
