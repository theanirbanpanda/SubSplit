package com.subsplit.marketplace.service.impl;

import com.subsplit.common.dto.PagedResponse;
import com.subsplit.common.entity.User;
import com.subsplit.common.entity.UserProfile;
import com.subsplit.common.enums.BillingCycle;
import com.subsplit.common.enums.ListingStatus;
import com.subsplit.common.exception.ResourceNotFoundException;
import com.subsplit.common.exception.UnauthorizedException;
import com.subsplit.listing.entity.Listing;
import com.subsplit.listing.repository.ListingRepository;
import com.subsplit.listing.repository.ListingSpecification;
import com.subsplit.marketplace.dto.*;
import com.subsplit.marketplace.service.MarketplaceService;
import com.subsplit.subscription.entity.Category;
import com.subsplit.subscription.entity.Subscription;
import com.subsplit.subscription.entity.SubscriptionPlan;
import com.subsplit.subscription.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarketplaceServiceImpl implements MarketplaceService {

    private final ListingRepository listingRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ListingResponse> getPagedListings(
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
            String sortDir
    ) {
        String validatedSortBy = sanitizeSortField(sortBy);
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, validatedSortBy));

        Specification<Listing> spec = ListingSpecification.filterListings(
                search, category, subscriptionId, minPrice, maxPrice, billingCycle, status, verifiedOnly
        );

        Page<Listing> listingPage = listingRepository.findAll(spec, pageable);
        Page<ListingResponse> responsePage = listingPage.map(this::mapToListingResponse);

        return PagedResponse.fromPage(responsePage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ListingResponse> getAllListings() {
        return listingRepository.findAll().stream()
                .map(this::mapToListingResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ListingResponse getListingById(Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + id));

        return mapToListingResponse(listing);
    }

    @Override
    @Transactional
    public ListingResponse createListing(User host, CreateListingRequest request) {
        SubscriptionPlan plan = subscriptionPlanRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found with id: " + request.getPlanId()));

        Listing listing = Listing.builder()
                .host(host)
                .plan(plan)
                .title(request.getTitle())
                .description(request.getDescription())
                .seatPrice(request.getSeatPrice())
                .totalSeats(request.getTotalSeats())
                .availableSeats(request.getTotalSeats())
                .billingCycle(request.getBillingCycle())
                .status(ListingStatus.ACTIVE)
                .startDate(request.getStartDate() != null ? request.getStartDate() : LocalDate.now())
                .expiryDate(request.getExpiryDate() != null ? request.getExpiryDate() : LocalDate.now().plusMonths(1))
                .build();

        Listing savedListing = listingRepository.save(listing);
        return mapToListingResponse(savedListing);
    }

    @Override
    @Transactional
    public ListingResponse updateListing(User host, Long id, UpdateListingRequest request) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + id));

        validateOwnership(listing, host);

        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            listing.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            listing.setDescription(request.getDescription());
        }
        if (request.getSeatPrice() != null) {
            listing.setSeatPrice(request.getSeatPrice());
        }
        if (request.getAvailableSeats() != null) {
            listing.setAvailableSeats(request.getAvailableSeats());
            if (request.getAvailableSeats() == 0) {
                listing.setStatus(ListingStatus.FULL);
            }
        }
        if (request.getBillingCycle() != null) {
            listing.setBillingCycle(request.getBillingCycle());
        }
        if (request.getStatus() != null) {
            listing.setStatus(request.getStatus());
        }

        Listing updatedListing = listingRepository.save(listing);
        return mapToListingResponse(updatedListing);
    }

    @Override
    @Transactional
    public void deleteListing(User host, Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + id));

        validateOwnership(listing, host);

        listing.setStatus(ListingStatus.CANCELLED);
        listingRepository.save(listing);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ListingResponse> getMyListings(User host) {
        return listingRepository.findByHostId(host.getId()).stream()
                .map(this::mapToListingResponse)
                .collect(Collectors.toList());
    }

    private void validateOwnership(Listing listing, User host) {
        if (!Objects.equals(listing.getHost().getId(), host.getId())) {
            throw new UnauthorizedException("You do not have permission to modify this listing");
        }
    }

    private String sanitizeSortField(String sortBy) {
        if (sortBy == null) return "createdAt";
        return switch (sortBy) {
            case "price", "seatPrice" -> "seatPrice";
            case "title" -> "title";
            case "availableSeats" -> "availableSeats";
            default -> "createdAt";
        };
    }

    private ListingResponse mapToListingResponse(Listing listing) {
        User host = listing.getHost();
        SubscriptionPlan plan = listing.getPlan();
        Subscription subscription = plan != null ? plan.getSubscription() : null;
        Category category = subscription != null ? subscription.getCategory() : null;

        // Calculate host details
        UserProfile profile = host != null ? host.getProfile() : null;
        String hostName = host != null ?
                ((host.getFirstName() != null ? host.getFirstName() : "") +
                        " " + (host.getLastName() != null ? host.getLastName() : "")).trim()
                : "Verified Host";

        if (hostName.isEmpty() && host != null) {
            hostName = host.getEmail();
        }

        HostSummaryDto hostSummary = HostSummaryDto.builder()
                .id(host != null ? host.getId() : null)
                .name(hostName)
                .email(host != null ? host.getEmail() : null)
                .profileImage(host != null ? host.getProfileImage() : null)
                .bio(profile != null ? profile.getBio() : null)
                .rating(4.9)
                .isKycVerified(host != null && Boolean.TRUE.equals(host.getEmailVerified()))
                .successfulGroups(10)
                .build();

        // Calculate subscription details
        SubscriptionSummaryDto subscriptionSummary = SubscriptionSummaryDto.builder()
                .id(subscription != null ? subscription.getId() : null)
                .providerName(subscription != null ? subscription.getProviderName() : "Subscription")
                .logoUrl(subscription != null ? subscription.getLogoUrl() : null)
                .officialWebsite(subscription != null ? subscription.getOfficialWebsite() : null)
                .categoryId(category != null ? category.getId() : null)
                .categoryName(category != null ? category.getCategoryName() : "General")
                .build();

        // Calculate plan details
        SubscriptionPlanSummaryDto planSummary = SubscriptionPlanSummaryDto.builder()
                .id(plan != null ? plan.getId() : null)
                .planName(plan != null ? plan.getPlanName() : null)
                .maxMembers(plan != null ? plan.getMaxMembers() : listing.getTotalSeats())
                .monthlyPrice(plan != null ? plan.getMonthlyPrice() : null)
                .yearlyPrice(plan != null ? plan.getYearlyPrice() : null)
                .sharingAllowed(plan != null ? plan.getSharingAllowed() : true)
                .build();

        // Calculate savings percent compared to full monthly price
        int savingsPercent = 0;
        if (plan != null && plan.getMonthlyPrice() != null && plan.getMonthlyPrice().compareTo(BigDecimal.ZERO) > 0 && listing.getSeatPrice() != null) {
            BigDecimal original = plan.getMonthlyPrice();
            BigDecimal seat = listing.getSeatPrice();
            if (original.compareTo(seat) > 0) {
                BigDecimal diff = original.subtract(seat);
                savingsPercent = diff.multiply(BigDecimal.valueOf(100))
                        .divide(original, 0, RoundingMode.HALF_UP)
                        .intValue();
            }
        }

        return ListingResponse.builder()
                .id(listing.getId())
                .title(listing.getTitle())
                .description(listing.getDescription())
                .seatPrice(listing.getSeatPrice())
                .totalSeats(listing.getTotalSeats())
                .availableSeats(listing.getAvailableSeats())
                .billingCycle(listing.getBillingCycle())
                .status(listing.getStatus())
                .startDate(listing.getStartDate())
                .expiryDate(listing.getExpiryDate())
                .createdAt(listing.getCreatedAt())
                .savingsPercent(savingsPercent)
                .isVerifiedHost(hostSummary.getIsKycVerified())
                .isAiVerified(listing.getOwnershipProofs() != null && !listing.getOwnershipProofs().isEmpty())
                .isEscrowProtected(true)
                .host(hostSummary)
                .subscription(subscriptionSummary)
                .plan(planSummary)
                .build();
    }
}
