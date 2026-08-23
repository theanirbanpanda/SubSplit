package com.subsplit.review.dto;

import lombok.Data;

@Data
public class CreateReviewRequest {
    private Long listingId;
    private Long membershipId;
    private Long revieweeId;
    private Integer rating;
    private String reviewText;
}
