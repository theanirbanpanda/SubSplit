package com.subsplit.message.repository;

import com.subsplit.message.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c WHERE c.participant1.id = :userId OR c.participant2.id = :userId ORDER BY c.lastMessageAt DESC")
    List<Conversation> findUserConversations(@Param("userId") Long userId);

    @Query("SELECT c FROM Conversation c WHERE " +
            "((c.participant1.id = :u1 AND c.participant2.id = :u2) OR (c.participant1.id = :u2 AND c.participant2.id = :u1)) " +
            "AND (:listingId IS NULL OR c.listing.id = :listingId)")
    List<Conversation> findBetweenUsersAndListing(
            @Param("u1") Long user1Id,
            @Param("u2") Long user2Id,
            @Param("listingId") Long listingId);

    @Query("SELECT c FROM Conversation c WHERE " +
            "(c.participant1.id = :u1 AND c.participant2.id = :u2) OR (c.participant1.id = :u2 AND c.participant2.id = :u1)")
    List<Conversation> findBetweenUsers(
            @Param("u1") Long user1Id,
            @Param("u2") Long user2Id);
}
