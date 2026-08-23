package com.subsplit.review.service.impl;

import com.subsplit.marketplace.dto.ListingReviewResponse;
import com.subsplit.marketplace.dto.ReviewDto;
import com.subsplit.review.entity.Review;
import com.subsplit.review.repository.ReviewRepository;
import com.subsplit.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    public Review createReview(com.subsplit.common.entity.User user, com.subsplit.review.dto.CreateReviewRequest request) {
        Review review = new Review();
        review.setReviewer(user);
        
        if (request.getRevieweeId() != null) {
            com.subsplit.common.entity.User reviewee = new com.subsplit.common.entity.User();
            reviewee.setId(request.getRevieweeId());
            review.setReviewee(reviewee);
        }
        
        if (request.getListingId() != null) {
            com.subsplit.listing.entity.Listing listing = new com.subsplit.listing.entity.Listing();
            listing.setId(request.getListingId());
            review.setListing(listing);
        }
        
        if (request.getMembershipId() != null) {
            com.subsplit.membership.entity.Membership membership = new com.subsplit.membership.entity.Membership();
            membership.setId(request.getMembershipId());
            review.setMembership(membership);
        }
        
        review.setRating(request.getRating());
        review.setReviewText(request.getReviewText());
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @Override
    public ListingReviewResponse getUserReviews(Long userId) {
        List<Review> reviews = reviewRepository.findAllUserRelatedReviewsOrderByCreatedAtDesc(userId);

        if (reviews.isEmpty()) {
            return ListingReviewResponse.builder()
                    .averageRating(5.0)
                    .totalReviews(0L)
                    .reviews(List.of())
                    .build();
        }

        double sum = 0.0;
        for (Review r : reviews) {
            sum += r.getRating() != null ? r.getRating() : 5;
        }
        double avg = Math.round((sum / reviews.size()) * 10.0) / 10.0;

        List<ReviewDto> dtos = reviews.stream().map(r -> {
            String reviewerName = "Verified Member";
            String initials = "VM";
            String avatar = null;
            Long reviewerId = null;

            if (r.getReviewer() != null) {
                reviewerId = r.getReviewer().getId();
                String first = r.getReviewer().getFirstName() != null ? r.getReviewer().getFirstName() : "";
                String last = r.getReviewer().getLastName() != null ? r.getReviewer().getLastName() : "";
                reviewerName = (first + " " + last).trim();
                if (reviewerName.isEmpty()) {
                    reviewerName = r.getReviewer().getEmail() != null ? r.getReviewer().getEmail() : "Verified Member";
                }
                avatar = r.getReviewer().getProfileImage();

                if (!first.isEmpty() && !last.isEmpty()) {
                    initials = (first.substring(0, 1) + last.substring(0, 1)).toUpperCase();
                } else if (!reviewerName.isEmpty()) {
                    initials = reviewerName.substring(0, Math.min(2, reviewerName.length())).toUpperCase();
                }
            }

            Long listingId = null;
            String listingTitle = null;
            Boolean isHost = false;
            
            if (r.getListing() != null) {
                listingId = r.getListing().getId();
                listingTitle = r.getListing().getTitle();
                if (r.getListing().getHost() != null && r.getListing().getHost().getId().equals(userId)) {
                    isHost = true;
                }
            } else if (r.getMembership() != null && r.getMembership().getListing() != null) {
                listingId = r.getMembership().getListing().getId();
                listingTitle = r.getMembership().getListing().getTitle();
                if (r.getMembership().getListing().getHost() != null && r.getMembership().getListing().getHost().getId().equals(userId)) {
                    isHost = true;
                }
            }

            String dateStr = r.getCreatedAt() != null ?
                    r.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")) : "Recently";

            return ReviewDto.builder()
                    .id(r.getId())
                    .reviewerId(reviewerId)
                    .reviewerName(reviewerName)
                    .reviewerAvatar(avatar)
                    .reviewerInitials(initials)
                    .avatarBg("#2563eb")
                    .city("Verified Joinee")
                    .rating(r.getRating() != null ? r.getRating() : 5)
                    .reviewText(r.getReviewText())
                    .formattedDate(dateStr)
                    .createdAt(r.getCreatedAt())
                    .isVerifiedMember(true)
                    .helpfulCount(0)
                    .listingId(listingId)
                    .listingTitle(listingTitle)
                    .isHostReview(isHost)
                    .build();
        }).collect(Collectors.toList());

        return ListingReviewResponse.builder()
                .averageRating(avg)
                .totalReviews((long) reviews.size())
                .reviews(dtos)
                .build();
    }
}
