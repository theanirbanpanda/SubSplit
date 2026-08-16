package com.subsplit.marketplace.service.impl;

import com.subsplit.common.dto.PagedResponse;
import com.subsplit.common.entity.Role;
import com.subsplit.common.entity.User;
import com.subsplit.common.entity.UserProfile;
import com.subsplit.common.enums.BillingCycle;
import com.subsplit.common.enums.ListingStatus;
import com.subsplit.common.exception.BadRequestException;
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

import java.time.LocalDateTime;
import com.subsplit.common.enums.JoinRequestStatus;

import com.subsplit.listing.entity.JoinRequest;
import com.subsplit.listing.entity.OwnershipProof;
import com.subsplit.listing.repository.JoinRequestRepository;
import com.subsplit.membership.entity.Membership;
import com.subsplit.membership.repository.MembershipRepository;
import com.subsplit.review.entity.Review;
import com.subsplit.review.repository.ReviewRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.subsplit.common.enums.TransactionType;
import com.subsplit.wallet.entity.Wallet;
import com.subsplit.wallet.entity.WalletTransaction;
import com.subsplit.wallet.repository.WalletRepository;
import com.subsplit.wallet.repository.WalletTransactionRepository;

import com.subsplit.notification.service.NotificationService;
import com.subsplit.common.enums.NotificationType;

@Service
public class MarketplaceServiceImpl implements MarketplaceService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(MarketplaceServiceImpl.class);

    private final ListingRepository listingRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final CategoryRepository categoryRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReviewRepository reviewRepository;
    private final JoinRequestRepository joinRequestRepository;
    private final MembershipRepository membershipRepository;
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final NotificationService notificationService;

    public MarketplaceServiceImpl(
            ListingRepository listingRepository,
            SubscriptionPlanRepository subscriptionPlanRepository,
            CategoryRepository categoryRepository,
            SubscriptionRepository subscriptionRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            ReviewRepository reviewRepository,
            JoinRequestRepository joinRequestRepository,
            MembershipRepository membershipRepository,
            WalletRepository walletRepository,
            WalletTransactionRepository walletTransactionRepository,
            NotificationService notificationService) {
        this.listingRepository = listingRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.categoryRepository = categoryRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.reviewRepository = reviewRepository;
        this.joinRequestRepository = joinRequestRepository;
        this.membershipRepository = membershipRepository;
        this.walletRepository = walletRepository;
        this.walletTransactionRepository = walletTransactionRepository;
        this.notificationService = notificationService;
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<ListingResponse> getPagedListings(
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
            String sortDir) {
        String validatedSortBy = sanitizeSortField(sortBy);
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, validatedSortBy));

        List<Long> excludeListingIds = new ArrayList<>();
        if (excludeHostId != null) {
            try {
                List<Long> joinReqListingIds = joinRequestRepository.findListingIdsByMemberIdNonRejected(excludeHostId);
                if (joinReqListingIds != null)
                    excludeListingIds.addAll(joinReqListingIds);

                List<Long> membershipListingIds = membershipRepository.findListingIdsByMemberId(excludeHostId);
                if (membershipListingIds != null)
                    excludeListingIds.addAll(membershipListingIds);
            } catch (Exception e) {
                log.error("Failed to query joinee listing IDs for user exclusion: ", e);
            }
        }

        Specification<Listing> spec = ListingSpecification.filterListings(
                excludeHostId, excludeListingIds, search, category, subscriptionId, minPrice, maxPrice, billingCycle,
                status, verifiedOnly);

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
                            .role(roleRepository.findByName("HOST")
                                    .orElseGet(() -> roleRepository
                                            .save(Role.builder().name("HOST").description("Host Role").build())))
                            .isActive(true)
                            .emailVerified(true)
                            .build()));
        }

        if (request == null) {
            throw new BadRequestException("Listing creation payload is required");
        }
        if (request.getTitle() == null || request.getTitle().trim().length() < 3) {
            throw new BadRequestException("Listing title must be at least 3 characters long");
        }
        if (request.getSeatPrice() == null || request.getSeatPrice().compareTo(BigDecimal.ONE) < 0) {
            throw new BadRequestException("Seat price must be at least ₹1");
        }
        if (request.getTotalSeats() == null || request.getTotalSeats() < 1) {
            throw new BadRequestException("Total seats must be at least 1");
        }

        Integer availableSeats = request.getAvailableSeats() != null ? request.getAvailableSeats()
                : request.getTotalSeats();
        if (availableSeats > request.getTotalSeats()) {
            throw new BadRequestException("Available seats (" + availableSeats + ") cannot exceed total seats ("
                    + request.getTotalSeats() + ")");
        }

        SubscriptionPlan plan = resolveOrCreateSubscriptionPlan(request);
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

        try {
            if (host != null) {
                notificationService.createNotification(
                        host,
                        NotificationType.SYSTEM,
                        "Group Pass Published 🚀",
                        "Your subscription pass '" + savedListing.getTitle() + "' is now active on the Marketplace!");
            }
        } catch (Exception e) {
            log.error("Failed to send notification on listing creation: ", e);
        }

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
                if (hostName.isEmpty())
                    hostName = host.getEmail();

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
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Subscription plan not found with id: " + request.getPlanId()));
        }

        String providerName = (request.getProviderName() != null && !request.getProviderName().isBlank())
                ? request.getProviderName().trim()
                : "Custom Subscription";
        String catName = (request.getCategoryName() != null && !request.getCategoryName().isBlank())
                ? request.getCategoryName().trim()
                : "General";
        String planName = (request.getPlanName() != null && !request.getPlanName().isBlank())
                ? request.getPlanName().trim()
                : "Standard Plan";

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
                        .yearlyPrice(
                                request.getSeatPrice() != null ? request.getSeatPrice().multiply(BigDecimal.valueOf(10))
                                        : BigDecimal.ZERO)
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
        if (sortBy == null)
            return "createdAt";
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
        String hostName = host != null ? ((host.getFirstName() != null ? host.getFirstName() : "") +
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
        if (plan != null && plan.getMonthlyPrice() != null && plan.getMonthlyPrice().compareTo(BigDecimal.ZERO) > 0
                && listing.getSeatPrice() != null) {
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

    @Override
    @Transactional(readOnly = true)
    public ListingDetailResponse getListingDetailById(Long id) {
        return getListingDetailById(null, id);
    }

    @Override
    @Transactional(readOnly = true)
    public ListingDetailResponse getListingDetailById(User currentUser, Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + id));

        ListingResponse baseResponse = mapToListingResponse(listing);
        String providerName = (baseResponse.getSubscription() != null
                && baseResponse.getSubscription().getProviderName() != null)
                        ? baseResponse.getSubscription().getProviderName()
                        : "Subscription";

        // Generate Specs based on provider
        String quality = resolveQuality(providerName);
        String devices = resolveDevices(providerName);
        String accessMethod = resolveAccessMethod(providerName);

        List<String> features = List.of(
                "Instant Access Credentials",
                "Ad-Free Premium Experience",
                "Dedicated Private Profile",
                "Multi-Device Support",
                "100% Escrow Protection");

        List<String> rules = List.of(
                "Do not share account login credentials with external parties.",
                "Only log in on approved screens/devices.",
                "Timely monthly renewals to maintain active slot.",
                "Respect other group profile settings.");

        // Fetch Occupants (Real database memberships only)
        List<Membership> memberships = membershipRepository.findByListingId(id);
        List<OccupantDto> occupants = new ArrayList<>();
        for (int i = 0; i < memberships.size(); i++) {
            Membership m = memberships.get(i);
            User mUser = m.getMember();
            String name = mUser != null ? mUser.getFullName() : "Member " + (i + 1);
            if (name == null || name.isBlank() || name.equalsIgnoreCase("null null")) {
                name = (mUser != null && mUser.getUsername() != null) ? mUser.getUsername() : "Member " + (i + 1);
            }
            String initials = getInitials(name);
            occupants.add(OccupantDto.builder()
                    .id(m.getId())
                    .seatNumber(i + 1)
                    .memberId(mUser != null ? mUser.getId() : null)
                    .memberName(name)
                    .memberAvatar(mUser != null ? mUser.getProfileImage() : null)
                    .memberInitials(initials)
                    .joinedDate(m.getCreatedAt() != null ? m.getCreatedAt().toLocalDate() : LocalDate.now())
                    .status(m.getStatus() != null ? m.getStatus().name() : "ACTIVE")
                    .build());
        }

        // Ownership proofs
        String aiProofType = "Subscription Invoice";
        String aiValidationStatus = "PASSED";
        if (listing.getOwnershipProofs() != null && !listing.getOwnershipProofs().isEmpty()) {
            OwnershipProof proof = listing.getOwnershipProofs().get(0);
            if (proof.getProofType() != null) aiProofType = proof.getProofType().name();
            if (proof.getAiStatus() != null) aiValidationStatus = proof.getAiStatus().name();
        }

        ListingReviewResponse reviews = getListingReviews(id);

        boolean isHost = currentUser != null && listing.getHost() != null && Objects.equals(listing.getHost().getId(), currentUser.getId());
        boolean isJoined = isHost;
        String myReqStatus = null;

        if (currentUser != null) {
            if (membershipRepository.findByMemberIdAndListingId(currentUser.getId(), id).isPresent()) {
                isJoined = true;
                myReqStatus = "APPROVED";
            }
            JoinRequest myReq = joinRequestRepository.findByMemberIdAndListingId(currentUser.getId(), id).orElse(null);
            if (myReq != null && myReq.getStatus() != JoinRequestStatus.REJECTED && myReq.getStatus() != JoinRequestStatus.CANCELLED) {
                isJoined = true;
                myReqStatus = myReq.getStatus().name();
            }
        }

        return ListingDetailResponse.builder()
                .id(baseResponse.getId())
                .title(baseResponse.getTitle())
                .description(baseResponse.getDescription())
                .seatPrice(baseResponse.getSeatPrice())
                .monthlyPrice(baseResponse.getPlan() != null ? baseResponse.getPlan().getMonthlyPrice() : baseResponse.getSeatPrice().multiply(BigDecimal.valueOf(3)))
                .totalSeats(baseResponse.getTotalSeats())
                .availableSeats(baseResponse.getAvailableSeats())
                .billingCycle(baseResponse.getBillingCycle())
                .status(baseResponse.getStatus())
                .startDate(baseResponse.getStartDate())
                .expiryDate(baseResponse.getExpiryDate())
                .createdAt(baseResponse.getCreatedAt())
                .savingsPercent(baseResponse.getSavingsPercent())
                .isVerifiedHost(baseResponse.getIsVerifiedHost())
                .isAiVerified(baseResponse.getIsAiVerified())
                .isEscrowProtected(baseResponse.getIsEscrowProtected())
                .aiProofType(aiProofType)
                .aiValidationStatus(aiValidationStatus)
                .quality(quality)
                .supportedDevices(devices)
                .region("India (en-IN)")
                .accessMethod(accessMethod)
                .accountType("Legitimate Shared Family Slot")
                .supportAvailability("24/7 Priority Support")
                .features(features)
                .rules(rules)
                .host(baseResponse.getHost())
                .subscription(baseResponse.getSubscription())
                .plan(baseResponse.getPlan())
                .occupants(occupants)
                .reviewSummary(reviews)
                .isJoined(isJoined)
                .isHost(isHost)
                .myRequestStatus(myReqStatus)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ListingResponse> getSimilarListings(Long listingId) {
        Listing listing = listingRepository.findById(listingId).orElse(null);
        if (listing == null) {
            return listingRepository.findTop4ByIdNotAndStatus(listingId, ListingStatus.ACTIVE)
                    .stream().map(this::mapToListingResponse).collect(Collectors.toList());
        }

        List<Listing> similar = new ArrayList<>();
        Subscription sub = listing.getPlan() != null ? listing.getPlan().getSubscription() : null;
        if (sub != null) {
            similar = listingRepository.findByPlanSubscriptionIdAndIdNot(sub.getId(), listingId);
            if (similar.isEmpty() && sub.getCategory() != null) {
                similar = listingRepository.findByPlanSubscriptionCategoryIdAndIdNot(sub.getCategory().getId(), listingId);
            }
        }

        return similar.stream().map(this::mapToListingResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ListingReviewResponse getListingReviews(Long listingId) {
        Listing listing = listingRepository.findById(listingId).orElse(null);
        List<Review> dbReviews = new ArrayList<>();
        if (listing != null) {
            dbReviews = reviewRepository.findByListingId(listingId);
            if (dbReviews.isEmpty() && listing.getHost() != null) {
                dbReviews = reviewRepository.findByRevieweeId(listing.getHost().getId());
            }
        }

        List<ReviewDto> reviews = new ArrayList<>();
        if (!dbReviews.isEmpty()) {
            for (Review r : dbReviews) {
                User rev = r.getReviewer();
                String name = rev != null ? rev.getFullName() : "Verified Member";
                if (name == null || name.isBlank() || name.equalsIgnoreCase("null null") || name.equalsIgnoreCase("null")) {
                    name = (rev != null && rev.getUsername() != null && !rev.getUsername().isBlank())
                            ? rev.getUsername()
                            : (rev != null && rev.getEmail() != null ? rev.getEmail().split("@")[0] : "Verified Member");
                }
                reviews.add(ReviewDto.builder()
                        .id(r.getId())
                        .reviewerId(rev != null ? rev.getId() : null)
                        .reviewerName(name)
                        .reviewerAvatar(rev != null ? rev.getProfileImage() : null)
                        .reviewerInitials(getInitials(name))
                        .avatarBg("#2563eb")
                        .city("Verified User")
                        .rating(r.getRating() != null ? r.getRating() : 5)
                        .reviewText(r.getReviewText())
                        .formattedDate(r.getCreatedAt() != null
                                ? r.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy"))
                                : "Recently")
                        .createdAt(r.getCreatedAt())
                        .isVerifiedMember(true)
                        .helpfulCount(0)
                        .build());
            }
        }

        double avgRating = reviews.isEmpty() ? 0.0 : reviews.stream().mapToInt(ReviewDto::getRating).average().orElse(0.0);
        avgRating = Math.round(avgRating * 10.0) / 10.0;

        return ListingReviewResponse.builder()
                .averageRating(avgRating)
                .totalReviews((long) reviews.size())
                .reviews(reviews)
                .build();
    }

    @Override
    @Transactional
    public ReviewDto createListingReview(User reviewer, Long listingId, CreateReviewRequest request) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + listingId));

        if (reviewer == null) {
            reviewer = userRepository.findAll().stream().findFirst().orElseThrow();
        }

        // Constraint 1: Host cannot review themselves
        if (listing.getHost() != null && Objects.equals(listing.getHost().getId(), reviewer.getId())) {
            throw new BadRequestException("You cannot submit a review on your own listing");
        }

        // Constraint 2: One review per joinee per listing
        if (reviewRepository.existsByReviewerIdAndMembershipListingId(reviewer.getId(), listingId)) {
            throw new BadRequestException("You have already submitted a review for this listing");
        }

        // Constraint 3: Plain text only & max 500 characters validation
        String plainText = request.getReviewText() != null ? request.getReviewText().replaceAll("<[^>]*>", "").trim()
                : "";
        if (plainText.length() < 5 || plainText.length() > 500) {
            throw new BadRequestException("Review comment must be plain text between 5 and 500 characters");
        }

        Membership membership = membershipRepository.findByMemberIdAndListingId(reviewer.getId(), listingId)
                .orElse(null);

        Review review = Review.builder()
                .reviewer(reviewer)
                .reviewee(listing.getHost())
                .listing(listing)
                .membership(membership)
                .rating(request.getRating())
                .reviewText(plainText)
                .build();

        Review saved = reviewRepository.save(review);
        String name = reviewer.getFullName();
        if (name == null || name.isBlank() || name.equalsIgnoreCase("null null") || name.equalsIgnoreCase("null")) {
            name = reviewer.getUsername() != null && !reviewer.getUsername().isBlank()
                    ? reviewer.getUsername()
                    : (reviewer.getEmail() != null ? reviewer.getEmail().split("@")[0] : "Verified Member");
        }

        return ReviewDto.builder()
                .id(saved.getId())
                .reviewerId(reviewer.getId())
                .reviewerName(name)
                .reviewerAvatar(reviewer.getProfileImage())
                .reviewerInitials(getInitials(name))
                .avatarBg("#2563eb")
                .city("Verified Member")
                .rating(saved.getRating())
                .reviewText(saved.getReviewText())
                .formattedDate("Just now")
                .createdAt(saved.getCreatedAt())
                .isVerifiedMember(true)
                .helpfulCount(0)
                .listingId(listing.getId())
                .listingTitle(listing.getTitle())
                .build();
    }

    @Override
    @Transactional
    public JoinRequestResponse submitJoinRequest(User member, Long listingId, JoinRequestCreateDto request) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new ResourceNotFoundException("Listing not found with id: " + listingId));

        if (member == null) {
            member = userRepository.findAll().stream().findFirst().orElseThrow();
        }

        if (listing.getHost() != null && Objects.equals(listing.getHost().getId(), member.getId())) {
            throw new BadRequestException("You cannot join your own listing group");
        }

        // 1. Check if user KYC is completed before checking wallet balance
        boolean isKycCompleted = Boolean.TRUE.equals(member.getEmailVerified());
        if (!isKycCompleted) {
            throw new IllegalArgumentException(
                    "KYC_REQUIRED: Please complete your KYC verification before joining a group listing.");
        }

        BigDecimal requiredAmount = listing.getSeatPrice() != null ? listing.getSeatPrice() : BigDecimal.ZERO;

        // Fetch or initialize user wallet
        User finalMember = member;
        Wallet wallet = walletRepository.findByUserId(member.getId())
                .orElseGet(() -> walletRepository.save(Wallet.builder()
                        .user(finalMember)
                        .balance(BigDecimal.ZERO)
                        .build()));

        // Check if user has enough amount available in wallet
        if (wallet.getBalance().compareTo(requiredAmount) < 0) {
            throw new IllegalArgumentException("Not enough balance in wallet. Available: ₹" + wallet.getBalance()
                    + ", Required: ₹" + requiredAmount);
        }

        // Deduct amount from user wallet
        wallet.setBalance(wallet.getBalance().subtract(requiredAmount));
        walletRepository.save(wallet);

        // Record transaction
        walletTransactionRepository.save(WalletTransaction.builder()
                .wallet(wallet)
                .transactionType(TransactionType.ESCROW_LOCK)
                .amount(requiredAmount)
                .referenceId(listingId)
                .remarks("Escrow deposit reserved for joining group: " + listing.getTitle())
                .build());

        // Send request to host of the listing
        JoinRequest joinReq = joinRequestRepository.findByListingIdAndMemberId(listingId, member.getId())
                .orElseGet(() -> JoinRequest.builder()
                        .listing(listing)
                        .member(finalMember)
                        .status(JoinRequestStatus.PENDING)
                        .message(request != null ? request.getMessage() : "Requesting to join group")
                        .build());

        joinReq.setStatus(JoinRequestStatus.PENDING);
        if (request != null && request.getMessage() != null) {
            joinReq.setMessage(request.getMessage());
        }

        JoinRequest saved = joinRequestRepository.save(joinReq);
        String memberName = (member.getFirstName() + " " + member.getLastName()).trim();
        if (memberName.isEmpty())
            memberName = member.getEmail();

        // Trigger real notifications
        try {
            if (listing.getHost() != null) {
                notificationService.createNotification(
                        listing.getHost(),
                        NotificationType.JOIN_REQUEST,
                        "New Join Request Received 📩",
                        memberName + " requested to join your group pass '" + listing.getTitle() + "'.");
            }
            notificationService.createNotification(
                    member,
                    NotificationType.JOIN_REQUEST,
                    "Group Join Request Sent 🎉",
                    "Your request to join '" + listing.getTitle() + "' was sent. ₹" + requiredAmount
                            + " reserved in escrow.");
        } catch (Exception e) {
            log.error("Failed to generate notification for join request: ", e);
        }

        return JoinRequestResponse.builder()
                .id(saved.getId())
                .listingId(listingId)
                .memberId(member.getId())
                .memberName(memberName)
                .status(saved.getStatus())
                .message(saved.getMessage())
                .walletBalance(wallet.getBalance())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public JoinRequestResponse getJoinRequestStatus(User member, Long listingId) {
        if (member == null)
            return null;

        return joinRequestRepository.findByListingIdAndMemberId(listingId, member.getId())
                .map(req -> {
                    String name = (member.getFirstName() + " " + member.getLastName()).trim();
                    return JoinRequestResponse.builder()
                            .id(req.getId())
                            .listingId(listingId)
                            .memberId(member.getId())
                            .memberName(name.isEmpty() ? member.getEmail() : name)
                            .status(req.getStatus())
                            .message(req.getMessage())
                            .createdAt(req.getCreatedAt())
                            .build();
                }).orElse(null);
    }

    private String resolveQuality(String provider) {
        String p = provider.toLowerCase();
        if (p.contains("netflix"))
            return "4K Ultra HD + HDR";
        if (p.contains("spotify"))
            return "Very High (320kbps)";
        if (p.contains("youtube"))
            return "4K 60fps Ad-Free";
        if (p.contains("canva"))
            return "Pro Vector Exports";
        if (p.contains("chatgpt"))
            return "GPT-4o & Unlimited Access";
        return "Premium High Definition";
    }

    private String resolveDevices(String provider) {
        String p = provider.toLowerCase();
        if (p.contains("netflix"))
            return "4 Screens (TV, Phone, Laptop)";
        if (p.contains("spotify"))
            return "Unlimited Devices (1 Active Stream)";
        if (p.contains("youtube"))
            return "Mobile, Web, Smart TV";
        if (p.contains("microsoft"))
            return "5 Devices per User";
        return "Multi-Screen Supported";
    }

    private String resolveAccessMethod(String provider) {
        String p = provider.toLowerCase();
        if (p.contains("spotify") || p.contains("youtube") || p.contains("canva") || p.contains("microsoft")) {
            return "Official Email Invite";
        }
        return "Dedicated Profile Credentials & PIN";
    }

    private String getInitials(String name) {
        if (name == null || name.isBlank())
            return "U";
        String[] parts = name.trim().split("\\s+");
        if (parts.length >= 2) {
            return (parts[0].substring(0, 1) + parts[1].substring(0, 1)).toUpperCase();
        }
        return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JoinRequestResponse> getMyJoinRequests(User member) {
        if (member == null) {
            return List.of();
        }

        List<JoinRequest> requests = joinRequestRepository.findByMemberIdOrderByCreatedAtDesc(member.getId());
        BigDecimal walletBal = walletRepository.findByUserId(member.getId())
                .map(w -> w.getBalance())
                .orElse(BigDecimal.ZERO);

        return requests.stream().map(req -> {
            Listing listing = req.getListing();
            String listingTitle = (listing != null) ? listing.getTitle() : "Subscription Group";
            String platform = (listing != null && listing.getPlan() != null
                    && listing.getPlan().getSubscription() != null)
                            ? listing.getPlan().getSubscription().getProviderName()
                            : "Pass";

            String hostName = (listing != null && listing.getHost() != null)
                    ? listing.getHost().getFullName()
                    : "Verified Host";
            BigDecimal price = (listing != null) ? listing.getSeatPrice() : BigDecimal.ZERO;

            LocalDateTime sharedAt = req.getCredentialsSharedAt();
            LocalDateTime deadlineAt = sharedAt != null ? sharedAt.plusHours(24) : null;

            return JoinRequestResponse.builder()
                    .id(req.getId())
                    .listingId(listing != null ? listing.getId() : null)
                    .memberId(member.getId())
                    .memberName(member.getFullName())
                    .status(req.getStatus())
                    .message(req.getMessage())
                    .listingTitle(listingTitle)
                    .platform(platform)
                    .hostName(hostName)
                    .price(price)
                    .walletBalance(walletBal)
                    .createdAt(req.getCreatedAt())
                    .shareType(req.getShareType() != null ? req.getShareType() : "CREDENTIALS")
                    .invitationLink(req.getInvitationLink())
                    .activationCode(req.getActivationCode())
                    .credentialsUsername(req.getCredentialsUsername())
                    .credentialsPassword(req.getCredentialsPassword())
                    .credentialsNotes(req.getCredentialsNotes())
                    .credentialsSharedAt(sharedAt)
                    .deadlineAt(deadlineAt)
                    .proofImage(req.getProofImage())
                    .proofSubmittedAt(req.getProofSubmittedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JoinRequestResponse> getHostJoinRequests(User host) {
        if (host == null) {
            return List.of();
        }

        List<JoinRequest> requests = joinRequestRepository.findByHostIdOrderByCreatedAtDesc(host.getId());
        return requests.stream().map(req -> {
            Listing listing = req.getListing();
            User member = req.getMember();
            String listingTitle = (listing != null) ? listing.getTitle() : "Subscription Group";
            String platform = (listing != null && listing.getPlan() != null
                    && listing.getPlan().getSubscription() != null)
                            ? listing.getPlan().getSubscription().getProviderName()
                            : "Pass";

            String memberName = (member != null) ? member.getFullName() : "Member";
            BigDecimal price = (listing != null) ? listing.getSeatPrice() : BigDecimal.ZERO;
            LocalDateTime sharedAt = req.getCredentialsSharedAt();
            LocalDateTime deadlineAt = sharedAt != null ? sharedAt.plusHours(24) : null;

            return JoinRequestResponse.builder()
                    .id(req.getId())
                    .listingId(listing != null ? listing.getId() : null)
                    .memberId(member != null ? member.getId() : null)
                    .memberName(memberName)
                    .status(req.getStatus())
                    .message(req.getMessage())
                    .listingTitle(listingTitle)
                    .platform(platform)
                    .hostName(host.getFullName())
                    .price(price)
                    .createdAt(req.getCreatedAt())
                    .shareType(req.getShareType() != null ? req.getShareType() : "CREDENTIALS")
                    .invitationLink(req.getInvitationLink())
                    .activationCode(req.getActivationCode())
                    .credentialsUsername(req.getCredentialsUsername())
                    .credentialsPassword(req.getCredentialsPassword())
                    .credentialsNotes(req.getCredentialsNotes())
                    .credentialsSharedAt(sharedAt)
                    .deadlineAt(deadlineAt)
                    .proofImage(req.getProofImage())
                    .proofSubmittedAt(req.getProofSubmittedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public JoinRequestResponse acceptJoinRequest(User host, Long requestId,
            ShareCredentialsRequest credentialsRequest) {
        JoinRequest joinReq = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Join request not found with id: " + requestId));

        Listing listing = joinReq.getListing();
        if (listing == null || listing.getHost() == null || !Objects.equals(listing.getHost().getId(), host.getId())) {
            throw new UnauthorizedException("You are not authorized to accept this join request");
        }

        if (joinReq.getStatus() != JoinRequestStatus.PENDING) {
            throw new BadRequestException("Request is already " + joinReq.getStatus());
        }

        // Save credentials, invitation link or activation code & set status to
        // CREDENTIALS_SHARED
        LocalDateTime now = LocalDateTime.now();
        String rawType = credentialsRequest.getShareType() != null ? credentialsRequest.getShareType().toUpperCase()
                : "CREDENTIALS";
        String targetShareType = "INVITATION_LINK".equals(rawType) ? "INVITATION_LINK"
                : "ACTIVATION_CODE".equals(rawType) ? "ACTIVATION_CODE"
                        : "CREDENTIALS";

        if ("INVITATION_LINK".equals(targetShareType)) {
            if (credentialsRequest.getInvitationLink() == null
                    || credentialsRequest.getInvitationLink().trim().isEmpty()) {
                throw new BadRequestException("Invitation link is required when sharing an invitation.");
            }
            joinReq.setShareType("INVITATION_LINK");
            joinReq.setInvitationLink(credentialsRequest.getInvitationLink().trim());
            joinReq.setActivationCode(null);
            joinReq.setCredentialsUsername(null);
            joinReq.setCredentialsPassword(null);
        } else if ("ACTIVATION_CODE".equals(targetShareType)) {
            if (credentialsRequest.getActivationCode() == null
                    || credentialsRequest.getActivationCode().trim().isEmpty()) {
                throw new BadRequestException("Activation code is required when sharing an activation code.");
            }
            joinReq.setShareType("ACTIVATION_CODE");
            joinReq.setActivationCode(credentialsRequest.getActivationCode().trim());
            joinReq.setInvitationLink(null);
            joinReq.setCredentialsUsername(null);
            joinReq.setCredentialsPassword(null);
        } else {
            if (credentialsRequest.getUsername() == null || credentialsRequest.getUsername().trim().isEmpty()
                    || credentialsRequest.getPassword() == null || credentialsRequest.getPassword().trim().isEmpty()) {
                throw new BadRequestException("Username and password are required when sharing credentials.");
            }
            joinReq.setShareType("CREDENTIALS");
            joinReq.setCredentialsUsername(credentialsRequest.getUsername().trim());
            joinReq.setCredentialsPassword(credentialsRequest.getPassword().trim());
            joinReq.setInvitationLink(null);
            joinReq.setActivationCode(null);
        }

        joinReq.setCredentialsNotes(credentialsRequest.getNotes());
        joinReq.setCredentialsSharedAt(now);
        joinReq.setStatus(JoinRequestStatus.CREDENTIALS_SHARED);

        JoinRequest savedReq = joinRequestRepository.save(joinReq);

        User member = joinReq.getMember();
        String memberName = member != null ? member.getFullName() : "Member";

        // Real-time notification to member
        try {
            if (member != null) {
                String notifTitle = "INVITATION_LINK".equals(targetShareType) ? "Invitation Link Shared 🔗"
                        : "ACTIVATION_CODE".equals(targetShareType) ? "Activation Code Shared 🔑"
                                : "Credentials Shared 🔑";

                String notifMsg = "INVITATION_LINK".equals(targetShareType)
                        ? "Host " + host.getFullName() + " shared an invitation link for '" + listing.getTitle()
                                + "'. Please join and submit proof within 24 hours."
                        : "ACTIVATION_CODE".equals(targetShareType)
                                ? "Host " + host.getFullName() + " shared an activation code for '" + listing.getTitle()
                                        + "'. Scratch to reveal your code and submit proof within 24 hours."
                                : "Host " + host.getFullName() + " shared login credentials for '" + listing.getTitle()
                                        + "'. Please test login and submit proof within 24 hours.";

                notificationService.createNotification(
                        member,
                        NotificationType.JOIN_REQUEST,
                        notifTitle,
                        notifMsg);
            }
        } catch (Exception e) {
            log.error("Failed to send notification on credentials/invitation shared: ", e);
        }

        LocalDateTime deadlineAt = now.plusHours(24);

        return JoinRequestResponse.builder()
                .id(savedReq.getId())
                .listingId(listing.getId())
                .memberId(member != null ? member.getId() : null)
                .memberName(memberName)
                .status(savedReq.getStatus())
                .message(savedReq.getMessage())
                .listingTitle(listing.getTitle())
                .price(listing.getSeatPrice())
                .createdAt(savedReq.getCreatedAt())
                .shareType(savedReq.getShareType() != null ? savedReq.getShareType() : "CREDENTIALS")
                .invitationLink(savedReq.getInvitationLink())
                .activationCode(savedReq.getActivationCode())
                .credentialsUsername(savedReq.getCredentialsUsername())
                .credentialsPassword(savedReq.getCredentialsPassword())
                .credentialsNotes(savedReq.getCredentialsNotes())
                .credentialsSharedAt(savedReq.getCredentialsSharedAt())
                .deadlineAt(deadlineAt)
                .build();
    }

    @Override
    @Transactional
    public JoinRequestResponse submitProofAndSettle(User user, Long requestId, SubmitProofRequest proofRequest) {
        JoinRequest joinReq = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Join request not found with id: " + requestId));

        Listing listing = joinReq.getListing();
        User host = listing != null ? listing.getHost() : null;
        User member = joinReq.getMember() != null ? joinReq.getMember() : user;

        if (joinReq.getStatus() == JoinRequestStatus.REJECTED || joinReq.getStatus() == JoinRequestStatus.CANCELLED) {
            throw new BadRequestException("Cannot submit proof for request with status: " + joinReq.getStatus());
        }

        if (joinReq.getStatus() == JoinRequestStatus.APPROVED) {
            return JoinRequestResponse.builder()
                    .id(joinReq.getId())
                    .listingId(listing != null ? listing.getId() : null)
                    .memberId(member.getId())
                    .memberName(member.getFullName())
                    .status(joinReq.getStatus())
                    .message(joinReq.getMessage())
                    .listingTitle(listing != null ? listing.getTitle() : "Group Pass")
                    .price(listing != null ? listing.getSeatPrice() : BigDecimal.ZERO)
                    .createdAt(joinReq.getCreatedAt())
                    .shareType(joinReq.getShareType() != null ? joinReq.getShareType() : "CREDENTIALS")
                    .invitationLink(joinReq.getInvitationLink())
                    .activationCode(joinReq.getActivationCode())
                    .credentialsUsername(joinReq.getCredentialsUsername())
                    .credentialsPassword(joinReq.getCredentialsPassword())
                    .credentialsNotes(joinReq.getCredentialsNotes())
                    .proofImage(joinReq.getProofImage())
                    .proofSubmittedAt(joinReq.getProofSubmittedAt())
                    .build();
        }

        // Save proof screenshot & update status to APPROVED
        LocalDateTime now = LocalDateTime.now();
        joinReq.setProofImage(proofRequest.getProofImage());
        joinReq.setProofSubmittedAt(now);
        joinReq.setStatus(JoinRequestStatus.APPROVED);
        JoinRequest savedReq = joinRequestRepository.save(joinReq);

        // Update available seats on listing
        if (listing != null && listing.getAvailableSeats() != null && listing.getAvailableSeats() > 0) {
            listing.setAvailableSeats(listing.getAvailableSeats() - 1);
            if (listing.getAvailableSeats() == 0) {
                listing.setStatus(ListingStatus.FULL);
            }
            listingRepository.save(listing);
        }

        // Release escrow money to host's wallet balance
        BigDecimal amount = (listing != null) ? listing.getSeatPrice() : BigDecimal.ZERO;
        if (host != null && amount != null && amount.compareTo(BigDecimal.ZERO) > 0) {
            try {
                Wallet hostWallet = walletRepository.findByUserId(host.getId())
                        .orElseGet(() -> walletRepository.save(Wallet.builder()
                                .user(host)
                                .balance(BigDecimal.ZERO)
                                .build()));

                hostWallet.setBalance(hostWallet.getBalance().add(amount));
                walletRepository.save(hostWallet);

                walletTransactionRepository.save(WalletTransaction.builder()
                        .wallet(hostWallet)
                        .transactionType(TransactionType.ESCROW_RELEASE)
                        .amount(amount)
                        .referenceId(listing != null ? listing.getId() : null)
                        .remarks("Escrow payment released for listing: "
                                + (listing != null ? listing.getTitle() : "Group Pass"))
                        .build());
            } catch (Exception e) {
                log.error("Failed to update wallet balance on escrow release: ", e);
            }
        }

        String memberName = member.getFullName();

        // Real-time notifications
        try {
            notificationService.createNotification(
                    member,
                    NotificationType.JOIN_REQUEST,
                    "Subscription Pass Activated 🎉",
                    "Your login proof for '" + (listing != null ? listing.getTitle() : "Pass")
                            + "' was verified! Pass is active.");

            if (host != null) {
                notificationService.createNotification(
                        host,
                        NotificationType.PAYMENT,
                        "Member Verified & Payout Settled 💰",
                        "₹" + amount + " released from escrow to your wallet for member " + memberName + ".");
            }
        } catch (Exception e) {
            log.error("Failed to send notification on proof verification: ", e);
        }

        return JoinRequestResponse.builder()
                .id(savedReq.getId())
                .listingId(listing != null ? listing.getId() : null)
                .memberId(member.getId())
                .memberName(memberName)
                .status(savedReq.getStatus())
                .message(savedReq.getMessage())
                .listingTitle(listing != null ? listing.getTitle() : "Group Pass")
                .price(amount)
                .createdAt(savedReq.getCreatedAt())
                .shareType(savedReq.getShareType() != null ? savedReq.getShareType() : "CREDENTIALS")
                .invitationLink(savedReq.getInvitationLink())
                .activationCode(savedReq.getActivationCode())
                .credentialsUsername(savedReq.getCredentialsUsername())
                .credentialsPassword(savedReq.getCredentialsPassword())
                .credentialsNotes(savedReq.getCredentialsNotes())
                .proofImage(savedReq.getProofImage())
                .proofSubmittedAt(savedReq.getProofSubmittedAt())
                .build();
    }

    @Override
    @Transactional
    public JoinRequestResponse rejectJoinRequest(User host, Long requestId) {
        JoinRequest joinReq = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Join request not found with id: " + requestId));

        Listing listing = joinReq.getListing();
        if (listing == null || listing.getHost() == null || !Objects.equals(listing.getHost().getId(), host.getId())) {
            throw new UnauthorizedException("You are not authorized to reject this join request");
        }

        if (joinReq.getStatus() != JoinRequestStatus.PENDING) {
            throw new BadRequestException("Request is already " + joinReq.getStatus());
        }

        // Reject join request
        joinReq.setStatus(JoinRequestStatus.REJECTED);
        JoinRequest savedReq = joinRequestRepository.save(joinReq);

        // Refund reserved escrow deposit back to member's wallet
        BigDecimal refundAmount = listing.getSeatPrice();
        User member = joinReq.getMember();
        if (member != null && refundAmount != null && refundAmount.compareTo(BigDecimal.ZERO) > 0) {
            Wallet memberWallet = walletRepository.findByUserId(member.getId()).orElse(null);
            if (memberWallet != null) {
                memberWallet.setBalance(memberWallet.getBalance().add(refundAmount));
                walletRepository.save(memberWallet);

                walletTransactionRepository.save(WalletTransaction.builder()
                        .wallet(memberWallet)
                        .transactionType(TransactionType.REFUND)
                        .amount(refundAmount)
                        .referenceId(listing.getId())
                        .remarks("Escrow deposit refunded for rejected request: " + listing.getTitle())
                        .build());
            }
        }

        String memberName = member != null ? member.getFullName() : "Member";

        // Real-time notification to member
        try {
            if (member != null) {
                notificationService.createNotification(
                        member,
                        NotificationType.JOIN_REQUEST,
                        "Join Request Declined ❌",
                        "Your request to join '" + listing.getTitle() + "' was declined by the host. ₹" + refundAmount
                                + " has been refunded to your wallet.");
            }
        } catch (Exception e) {
            log.error("Failed to send notification on reject join request: ", e);
        }

        return JoinRequestResponse.builder()
                .id(savedReq.getId())
                .listingId(listing.getId())
                .memberId(member != null ? member.getId() : null)
                .memberName(memberName)
                .status(savedReq.getStatus())
                .message(savedReq.getMessage())
                .listingTitle(listing.getTitle())
                .price(listing.getSeatPrice())
                .createdAt(savedReq.getCreatedAt())
                .build();
    }

    @Override
    public void deleteListingReview(User user, Long listingId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new com.subsplit.common.exception.ResourceNotFoundException("Review not found"));
        if (review.getReviewer() == null || !review.getReviewer().getId().equals(user.getId())) {
            throw new com.subsplit.common.exception.UnauthorizedException("You can only delete your own reviews");
        }
        reviewRepository.delete(review);
    }

}
