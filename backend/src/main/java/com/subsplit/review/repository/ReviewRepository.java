package com.subsplit.review.repository;

import com.subsplit.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRevieweeId(Long revieweeId);

    List<Review> findByMembershipListingId(Long listingId);

    long countByRevieweeId(Long revieweeId);
}

