package com.subsplit.marketplace.controller;

import com.subsplit.common.dto.ApiResponse;
import com.subsplit.common.dto.PagedResponse;
import com.subsplit.common.entity.User;
import com.subsplit.common.enums.BillingCycle;
import com.subsplit.common.enums.ListingStatus;
import com.subsplit.common.exception.UnauthorizedException;
import com.subsplit.marketplace.dto.CreateListingRequest;
import com.subsplit.marketplace.dto.ListingResponse;
import com.subsplit.marketplace.dto.UpdateListingRequest;
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
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PagedResponse<ListingResponse> pagedResponse = marketplaceService.getPagedListings(
                search, category, subscriptionId, minPrice, maxPrice, billingCycle, status, verifiedOnly, page, size, sortBy, sortDir
        );

        return ResponseEntity.ok(ApiResponse.success("Marketplace listings fetched successfully", pagedResponse));
    }

    @GetMapping("/listings/{id}")
    public ResponseEntity<ApiResponse<ListingResponse>> getListingById(@PathVariable Long id) {
        ListingResponse response = marketplaceService.getListingById(id);
        return ResponseEntity.ok(ApiResponse.success("Listing details retrieved successfully", response));
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
        User currentUser = getAuthenticatedUser(authentication);
        ListingResponse response = marketplaceService.createListing(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Listing created successfully", response));
    }

    @PutMapping("/listings/{id}")
    public ResponseEntity<ApiResponse<ListingResponse>> updateListing(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody UpdateListingRequest request
    ) {
        User currentUser = getAuthenticatedUser(authentication);
        ListingResponse response = marketplaceService.updateListing(currentUser, id, request);
        return ResponseEntity.ok(ApiResponse.success("Listing updated successfully", response));
    }

    @DeleteMapping("/listings/{id}")
    public ResponseEntity<ApiResponse<String>> deleteListing(
            Authentication authentication,
            @PathVariable Long id
    ) {
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
