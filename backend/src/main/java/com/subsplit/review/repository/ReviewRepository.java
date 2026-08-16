package com.subsplit.review.repository;

import com.subsplit.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRevieweeId(Long revieweeId);

    List<Review> findByRevieweeIdOrderByCreatedAtDesc(Long revieweeId);

    List<Review> findByMembershipListingId(Long listingId);
    List<Review> findByListingId(Long listingId);

    boolean existsByReviewerIdAndMembershipListingId(Long reviewerId, Long listingId);

    boolean existsByReviewerIdAndRevieweeId(Long reviewerId, Long revieweeId);

    long countByRevieweeId(Long revieweeId);

    @org.springframework.data.jpa.repository.Query("SELECT r FROM Review r WHERE r.reviewee.id = :userId OR (r.listing IS NOT NULL AND r.listing.host.id = :userId) ORDER BY r.createdAt DESC")
    List<Review> findAllUserRelatedReviewsOrderByCreatedAtDesc(@org.springframework.data.repository.query.Param("userId") Long userId);
}

