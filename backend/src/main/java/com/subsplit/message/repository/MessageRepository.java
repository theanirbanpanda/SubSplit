package com.subsplit.message.repository;

import com.subsplit.message.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversationIdOrderByCreatedAtAsc(Long conversationId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver.id = :userId AND m.isRead = false")
    long countUnreadMessagesByReceiverId(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.conversation.id = :conversationId AND m.receiver.id = :userId AND m.isRead = false")
    int markMessagesAsRead(@Param("conversationId") Long conversationId, @Param("userId") Long userId);
}
