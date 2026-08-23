package com.subsplit.review.controller;

import com.subsplit.common.dto.ApiResponse;
import com.subsplit.marketplace.dto.ListingReviewResponse;
import com.subsplit.review.entity.Review;
import com.subsplit.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/v1/reviews", "/api/reviews"})
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<Review>> createReview(@org.springframework.security.core.annotation.AuthenticationPrincipal com.subsplit.common.entity.User user, @RequestBody com.subsplit.review.dto.CreateReviewRequest request) {
        Review review = reviewService.createReview(user, request);
        return ResponseEntity.ok(ApiResponse.success(review));
    }

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<ListingReviewResponse>> getUserReviews(@PathVariable Long userId) {
        ListingReviewResponse response = reviewService.getUserReviews(userId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
