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
}
