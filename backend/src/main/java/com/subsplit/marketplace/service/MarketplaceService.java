package com.subsplit.marketplace.service;

import com.subsplit.common.dto.PagedResponse;
import com.subsplit.common.entity.User;
import com.subsplit.common.enums.BillingCycle;
import com.subsplit.common.enums.ListingStatus;
import com.subsplit.marketplace.dto.*;

import java.math.BigDecimal;
import java.util.List;

public interface MarketplaceService {

    PagedResponse<ListingResponse> getPagedListings(
            Long excludeHostId,
            String search,
            String category,
            Long subscriptionId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            BillingCycle billingCycle,
            ListingStatus status,
            Boolean verifiedOnly,
            int page,
            int size,
            String sortBy,
            String sortDir);

    List<ListingResponse> getAllListings();

    ListingResponse getListingById(Long id);

    ListingResponse createListing(User host, CreateListingRequest request);

    ListingResponse updateListing(User host, Long id, UpdateListingRequest request);

    void deleteListing(User host, Long id);

    List<ListingResponse> getMyListings(User host);

    List<CategoryResponse> getCategories();

    List<HostSummaryDto> getTopHosts();

    ListingDetailResponse getListingDetailById(Long id);

    ListingDetailResponse getListingDetailById(User currentUser, Long id);

    List<ListingResponse> getSimilarListings(Long listingId);

    ListingReviewResponse getListingReviews(Long listingId);

    ReviewDto createListingReview(User reviewer, Long listingId, CreateReviewRequest request);

    JoinRequestResponse submitJoinRequest(User member, Long listingId, JoinRequestCreateDto request);

    JoinRequestResponse getJoinRequestStatus(User member, Long listingId);

    List<JoinRequestResponse> getMyJoinRequests(User member);

    List<JoinRequestResponse> getHostJoinRequests(User host);

    JoinRequestResponse acceptJoinRequest(User host, Long requestId, ShareCredentialsRequest credentialsRequest);

    JoinRequestResponse submitProofAndSettle(User member, Long requestId, SubmitProofRequest proofRequest);

    JoinRequestResponse rejectJoinRequest(User host, Long requestId);
}
