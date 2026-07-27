package com.subsplit.marketplace.service.impl;

import com.subsplit.common.dto.PagedResponse;
import com.subsplit.common.entity.Role;
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
import com.subsplit.subscription.repository.CategoryRepository;
import com.subsplit.subscription.repository.SubscriptionPlanRepository;
import com.subsplit.subscription.repository.SubscriptionRepository;
import com.subsplit.user.repository.RoleRepository;
import com.subsplit.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketplaceServiceImpl implements MarketplaceService {

    private final ListingRepository listingRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final CategoryRepository categoryRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

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
        if (host == null) {
            host = userRepository.findAll().stream().findFirst()
                    .orElseGet(() -> userRepository.save(User.builder()
                            .email("host@subsplit.com")
                            .firstName("Default")
                            .lastName("Host")
                            .fullName("Default Host")
                            .passwordHash(passwordEncoder.encode("HostPassword123!"))
                            .role(roleRepository.findByName("HOST").orElseGet(() -> roleRepository.save(Role.builder().name("HOST").description("Host Role").build())))
                            .isActive(true)
                            .emailVerified(true)
                            .build()));
        }

        SubscriptionPlan plan = resolveOrCreateSubscriptionPlan(request);

        Integer availableSeats = request.getAvailableSeats() != null ? request.getAvailableSeats() : request.getTotalSeats();
        BillingCycle cycle = request.getBillingCycle() != null ? request.getBillingCycle() : BillingCycle.MONTHLY;

        Listing listing = Listing.builder()
                .host(host)
                .plan(plan)
                .title(request.getTitle())
                .description(request.getDescription())
                .seatPrice(request.getSeatPrice())
                .monthlyPrice(request.getSeatPrice())
                .totalSeats(request.getTotalSeats())
                .availableSeats(availableSeats)
                .billingCycle(cycle)
                .status(ListingStatus.ACTIVE)
                .startDate(request.getStartDate() != null ? request.getStartDate() : LocalDate.now())
                .expiryDate(request.getExpiryDate() != null ? request.getExpiryDate() : LocalDate.now().plusMonths(1))
                .build();

        Listing savedListing = listingRepository.save(listing);
        log.info("Successfully created new listing with ID: {}", savedListing.getId());
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
            listing.setMonthlyPrice(request.getSeatPrice());
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
        if (host == null) {
            return List.of();
        }
        return listingRepository.findByHostId(host.getId()).stream()
                .map(this::mapToListingResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategories() {
        List<Category> categories = categoryRepository.findAll();
        List<Listing> allListings = listingRepository.findAll();

        return categories.stream().map(cat -> {
            long count = allListings.stream()
                    .filter(l -> l.getPlan() != null
                            && l.getPlan().getSubscription() != null
                            && l.getPlan().getSubscription().getCategory() != null
                            && Objects.equals(l.getPlan().getSubscription().getCategory().getId(), cat.getId()))
                    .count();

            return CategoryResponse.builder()
                    .id(cat.getId())
                    .name(cat.getCategoryName())
                    .description(cat.getDescription())
                    .icon(cat.getIcon())
                    .listingCount(count)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<HostSummaryDto> getTopHosts() {
        List<Listing> listings = listingRepository.findAll();
        List<HostSummaryDto> hosts = new ArrayList<>();

        for (Listing l : listings) {
            User host = l.getHost();
            if (host != null && hosts.stream().noneMatch(h -> Objects.equals(h.getId(), host.getId()))) {
                UserProfile profile = host.getProfile();
                String hostName = ((host.getFirstName() != null ? host.getFirstName() : "") +
                        " " + (host.getLastName() != null ? host.getLastName() : "")).trim();
                if (hostName.isEmpty()) hostName = host.getEmail();

                long hostActiveListings = listings.stream()
                        .filter(item -> item.getHost() != null && Objects.equals(item.getHost().getId(), host.getId()))
                        .count();

                hosts.add(HostSummaryDto.builder()
                        .id(host.getId())
                        .name(hostName)
                        .email(host.getEmail())
                        .profileImage(host.getProfileImage())
                        .bio(profile != null ? profile.getBio() : "Verified SubSplit Host")
                        .rating(4.9)
                        .isKycVerified(Boolean.TRUE.equals(host.getEmailVerified()))
                        .successfulGroups((int) (hostActiveListings * 3 + 5))
                        .build());
            }
        }
        return hosts;
    }

    @Transactional
    public List<ListingResponse> seedData() {
        return listingRepository.findAll().stream()
                .map(this::mapToListingResponse)
                .collect(Collectors.toList());
    }

    private SubscriptionPlan resolveOrCreateSubscriptionPlan(CreateListingRequest request) {
        if (request.getPlanId() != null) {
            return subscriptionPlanRepository.findById(request.getPlanId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found with id: " + request.getPlanId()));
        }

        String providerName = (request.getProviderName() != null && !request.getProviderName().isBlank())
                ? request.getProviderName().trim() : "Custom Subscription";
        String catName = (request.getCategoryName() != null && !request.getCategoryName().isBlank())
                ? request.getCategoryName().trim() : "General";
        String planName = (request.getPlanName() != null && !request.getPlanName().isBlank())
                ? request.getPlanName().trim() : "Standard Plan";

        Category category = categoryRepository.findAll().stream()
                .filter(c -> c.getCategoryName().equalsIgnoreCase(catName))
                .findFirst()
                .orElseGet(() -> categoryRepository.save(Category.builder()
                        .categoryName(catName)
                        .description("Category for " + catName)
                        .icon("Assignment")
                        .monthlyPrice(BigDecimal.ZERO)
                        .active(true)
                        .build()));

        Subscription subscription = subscriptionRepository.findAll().stream()
                .filter(s -> s.getProviderName().equalsIgnoreCase(providerName))
                .findFirst()
                .orElseGet(() -> subscriptionRepository.save(Subscription.builder()
                        .providerName(providerName)
                        .planName(providerName)
                        .category(category)
                        .maxMembers(4)
                        .monthlyPrice(BigDecimal.ZERO)
                        .yearlyPrice(BigDecimal.ZERO)
                        .active(true)
                        .build()));

        return subscriptionPlanRepository.findBySubscriptionId(subscription.getId()).stream()
                .findFirst()
                .orElseGet(() -> subscriptionPlanRepository.save(SubscriptionPlan.builder()
                        .subscription(subscription)
                        .planName(planName)
                        .maxMembers(request.getTotalSeats() != null ? request.getTotalSeats() : 4)
                        .monthlyPrice(request.getSeatPrice() != null ? request.getSeatPrice() : BigDecimal.ZERO)
                        .yearlyPrice(request.getSeatPrice() != null ? request.getSeatPrice().multiply(BigDecimal.valueOf(10)) : BigDecimal.ZERO)
                        .sharingAllowed(true)
                        .active(true)
                        .build()));
    }

    private void validateOwnership(Listing listing, User host) {
        if (host != null && !Objects.equals(listing.getHost().getId(), host.getId())) {
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

        SubscriptionSummaryDto subscriptionSummary = SubscriptionSummaryDto.builder()
                .id(subscription != null ? subscription.getId() : null)
                .providerName(subscription != null ? subscription.getProviderName() : "Subscription")
                .logoUrl(subscription != null ? subscription.getLogoUrl() : null)
                .officialWebsite(subscription != null ? subscription.getOfficialWebsite() : null)
                .categoryId(category != null ? category.getId() : null)
                .categoryName(category != null ? category.getCategoryName() : "General")
                .build();

        SubscriptionPlanSummaryDto planSummary = SubscriptionPlanSummaryDto.builder()
                .id(plan != null ? plan.getId() : null)
                .planName(plan != null ? plan.getPlanName() : null)
                .maxMembers(plan != null ? plan.getMaxMembers() : listing.getTotalSeats())
                .monthlyPrice(plan != null ? plan.getMonthlyPrice() : null)
                .yearlyPrice(plan != null ? plan.getYearlyPrice() : null)
                .sharingAllowed(plan != null ? plan.getSharingAllowed() : true)
                .build();

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
