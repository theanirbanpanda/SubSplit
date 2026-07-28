package com.subsplit.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListingReviewResponse {
    private Double averageRating;
    private Long totalReviews;
    private List<ReviewDto> reviews;
}
