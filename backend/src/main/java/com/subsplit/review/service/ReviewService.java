package com.subsplit.review.service;

import com.subsplit.marketplace.dto.ListingReviewResponse;
import com.subsplit.review.entity.Review;

import java.util.List;

public interface ReviewService {

    List<Review> getAllReviews();

    ListingReviewResponse getUserReviews(Long userId);
}
