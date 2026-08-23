package com.subsplit.message.repository;

import com.subsplit.message.entity.MessageReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface MessageReactionRepository extends JpaRepository<MessageReaction, Long> {

    List<MessageReaction> findByMessageId(Long messageId);

    Optional<MessageReaction> findByMessageIdAndUserIdAndEmoji(Long messageId, Long userId, String emoji);

    void deleteByMessageIdAndUserIdAndEmoji(Long messageId, Long userId, String emoji);

    @Query("SELECT r.emoji, COUNT(r) FROM MessageReaction r WHERE r.message.id = :messageId GROUP BY r.emoji")
    List<Object[]> countReactionsByMessageId(@Param("messageId") Long messageId);

    @Query("SELECT r.message.id, r.emoji, COUNT(r) FROM MessageReaction r WHERE r.message.id IN :messageIds GROUP BY r.message.id, r.emoji")
    List<Object[]> countReactionsByMessageIds(@Param("messageIds") List<Long> messageIds);
}
