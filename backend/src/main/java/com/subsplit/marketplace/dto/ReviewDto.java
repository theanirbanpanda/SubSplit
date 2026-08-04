package com.subsplit.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {
    private Long id;
    private Long reviewerId;
    private String reviewerName;
    private String reviewerAvatar;
    private String reviewerInitials;
    private String avatarBg;
    private String city;
    private Integer rating;
    private String reviewText;
    private String formattedDate;
    private LocalDateTime createdAt;
    private Boolean isVerifiedMember;
    private Integer helpfulCount;
    private Long listingId;
    private String listingTitle;
}
