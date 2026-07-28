package com.subsplit.marketplace.controller;

import com.subsplit.common.dto.ApiResponse;
import com.subsplit.common.dto.PagedResponse;
import com.subsplit.common.entity.User;
import com.subsplit.common.enums.BillingCycle;
import com.subsplit.common.enums.ListingStatus;
import com.subsplit.common.exception.UnauthorizedException;
import com.subsplit.marketplace.dto.*;
import com.subsplit.marketplace.service.MarketplaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {

    private final MarketplaceService marketplaceService;

    @GetMapping("/listings")
    public ResponseEntity<ApiResponse<PagedResponse<ListingResponse>>> getListings(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Long subscriptionId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) BillingCycle billingCycle,
            @RequestParam(required = false) ListingStatus status,
            @RequestParam(required = false, defaultValue = "false") Boolean verifiedOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<ListingResponse> pagedResponse = marketplaceService.getPagedListings(
                search, category, subscriptionId, minPrice, maxPrice, billingCycle, status, verifiedOnly, page, size,
                sortBy, sortDir);

        return ResponseEntity.ok(ApiResponse.success("Marketplace listings fetched successfully", pagedResponse));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories() {
        List<CategoryResponse> categories = marketplaceService.getCategories();
        return ResponseEntity.ok(ApiResponse.success("Marketplace categories fetched successfully", categories));
    }

    @GetMapping("/hosts")
    public ResponseEntity<ApiResponse<List<HostSummaryDto>>> getTopHosts() {
        List<HostSummaryDto> hosts = marketplaceService.getTopHosts();
        return ResponseEntity.ok(ApiResponse.success("Top marketplace hosts fetched successfully", hosts));
    }

    @GetMapping("/listings/{id}")
    public ResponseEntity<ApiResponse<ListingDetailResponse>> getListingById(@PathVariable Long id) {
        ListingDetailResponse response = marketplaceService.getListingDetailById(id);
        return ResponseEntity.ok(ApiResponse.success("Listing details retrieved successfully", response));
    }

    @GetMapping("/listings/{id}/detail")
    public ResponseEntity<ApiResponse<ListingDetailResponse>> getListingDetailById(@PathVariable Long id) {
        ListingDetailResponse response = marketplaceService.getListingDetailById(id);
        return ResponseEntity.ok(ApiResponse.success("Listing full details retrieved successfully", response));
    }

    @GetMapping("/listings/{id}/similar")
    public ResponseEntity<ApiResponse<List<ListingResponse>>> getSimilarListings(@PathVariable Long id) {
        List<ListingResponse> response = marketplaceService.getSimilarListings(id);
        return ResponseEntity.ok(ApiResponse.success("Similar listings retrieved successfully", response));
    }

    @GetMapping("/listings/{id}/reviews")
    public ResponseEntity<ApiResponse<ListingReviewResponse>> getListingReviews(@PathVariable Long id) {
        ListingReviewResponse response = marketplaceService.getListingReviews(id);
        return ResponseEntity.ok(ApiResponse.success("Listing reviews retrieved successfully", response));
    }

    @PostMapping("/listings/{id}/reviews")
    public ResponseEntity<ApiResponse<ReviewDto>> createListingReview(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody CreateReviewRequest request) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        ReviewDto response = marketplaceService.createListingReview(currentUser, id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review created successfully", response));
    }

    @PostMapping("/listings/{id}/join-requests")
    public ResponseEntity<ApiResponse<JoinRequestResponse>> submitJoinRequest(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody(required = false) JoinRequestCreateDto request) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        JoinRequestResponse response = marketplaceService.submitJoinRequest(currentUser, id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Join request submitted successfully", response));
    }

    @GetMapping("/listings/{id}/join-requests/status")
    public ResponseEntity<ApiResponse<JoinRequestResponse>> getJoinRequestStatus(
            Authentication authentication,
            @PathVariable Long id) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        JoinRequestResponse response = marketplaceService.getJoinRequestStatus(currentUser, id);
        return ResponseEntity.ok(ApiResponse.success("Join request status retrieved successfully", response));
    }


    @GetMapping("/listings/my-listings")
    public ResponseEntity<ApiResponse<List<ListingResponse>>> getMyListings(Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        List<ListingResponse> response = marketplaceService.getMyListings(currentUser);
        return ResponseEntity.ok(ApiResponse.success("User listings retrieved successfully", response));
    }

    @PostMapping("/listings")
    public ResponseEntity<ApiResponse<ListingResponse>> createListing(
            Authentication authentication,
            @Valid @RequestBody CreateListingRequest request
    ) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        ListingResponse response = marketplaceService.createListing(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Listing created successfully", response));
    }

    private User getAuthenticatedUserOptional(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            return null;
        }
        return user;
    }

    @PutMapping("/listings/{id}")
    public ResponseEntity<ApiResponse<ListingResponse>> updateListing(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody UpdateListingRequest request) {
        User currentUser = getAuthenticatedUser(authentication);
        ListingResponse response = marketplaceService.updateListing(currentUser, id, request);
        return ResponseEntity.ok(ApiResponse.success("Listing updated successfully", response));
    }

    @DeleteMapping("/listings/{id}")
    public ResponseEntity<ApiResponse<String>> deleteListing(
            Authentication authentication,
            @PathVariable Long id) {
        User currentUser = getAuthenticatedUser(authentication);
        marketplaceService.deleteListing(currentUser, id);
        return ResponseEntity.ok(ApiResponse.success("Listing cancelled successfully", "Listing has been cancelled"));
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            throw new UnauthorizedException("User is not authenticated");
        }
        return user;
    }
}
