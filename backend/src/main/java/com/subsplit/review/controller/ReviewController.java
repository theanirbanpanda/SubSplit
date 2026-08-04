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
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

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
