package com.subsplit.review.service;

import com.subsplit.marketplace.dto.ListingReviewResponse;
import com.subsplit.review.entity.Review;
import com.subsplit.review.dto.CreateReviewRequest;
import com.subsplit.common.entity.User;

import java.util.List;

public interface ReviewService {

    List<Review> getAllReviews();

    ListingReviewResponse getUserReviews(Long userId);

    Review createReview(User user, CreateReviewRequest request);
}
