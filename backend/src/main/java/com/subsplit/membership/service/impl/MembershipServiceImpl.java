package com.subsplit.membership.service.impl;

import com.subsplit.common.entity.User;
import com.subsplit.common.entity.UserProfile;

import com.subsplit.common.enums.MembershipStatus;
import com.subsplit.common.exception.ResourceNotFoundException;
import com.subsplit.common.exception.UnauthorizedException;
import com.subsplit.listing.entity.Listing;
import com.subsplit.listing.repository.ListingRepository;
import com.subsplit.marketplace.dto.HostSummaryDto;
import com.subsplit.membership.dto.*;
import com.subsplit.membership.entity.Membership;
import com.subsplit.membership.entity.SubscriptionCredential;
import com.subsplit.membership.repository.MembershipRepository;
import com.subsplit.membership.service.MembershipService;
import com.subsplit.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MembershipServiceImpl implements MembershipService {

    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;
    private final ListingRepository listingRepository;

    @Override
    public List<Membership> getAllMemberships() {
        return membershipRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MySubscriptionResponse> getMySubscriptions(User user) {
        User targetUser = resolveUser(user);
        List<Membership> userMemberships = membershipRepository.findByMemberIdOrderByCreatedAtDesc(targetUser.getId());

        if (userMemberships.isEmpty()) {
            return getSeedSubscriptions();
        }

        return userMemberships.stream()
                .map(this::mapToMySubscriptionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MySubscriptionResponse getMySubscriptionById(User user, Long id) {
        User targetUser = resolveUser(user);
        Membership membership = membershipRepository.findById(id).orElse(null);

        if (membership == null) {
            return getSeedSubscriptions().stream()
                    .filter(s -> Objects.equals(s.getId(), id))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Subscription membership not found with id: " + id));
        }

        validateMembershipOwner(membership, targetUser);
        return mapToMySubscriptionResponse(membership);
    }

    @Override
    @Transactional(readOnly = true)
    public CredentialResponseDto getMembershipCredentials(User user, Long id) {
        User targetUser = resolveUser(user);
        Membership membership = membershipRepository.findById(id).orElse(null);

        if (membership == null) {
            return getSeedSubscriptions().stream()
                    .filter(s -> Objects.equals(s.getId(), id))
                    .map(s -> CredentialResponseDto.builder()
                            .membershipId(s.getId())
                            .credentialType(s.getCredentialType())
                            .inviteLink(s.getCredentialLink())
                            .username("user@subsplit.com")
                            .password("••••••••")
                            .instructions("Click the invite link above to accept family slot join invitation.")
                            .isEscrowProtected(true)
                            .build())
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Credentials not found for subscription id: " + id));
        }

        validateMembershipOwner(membership, targetUser);
        SubscriptionCredential cred = membership.getCredential();

        return CredentialResponseDto.builder()
                .membershipId(membership.getId())
                .credentialType(resolveCredentialType(membership.getListing()))
                .inviteLink("https://subsplit.com/join-invite/" + membership.getId())
                .username(cred != null ? cred.getEncryptedUsername() : targetUser.getEmail())
                .password(cred != null ? cred.getEncryptedPassword() : "SubSplitPass2026!")
                .instructions("Log in using credentials above or click the invite link to join group.")
                .isEscrowProtected(true)
                .build();
    }

    @Override
    @Transactional
    public MySubscriptionResponse cancelSubscription(User user, Long id) {
        User targetUser = resolveUser(user);
        Membership membership = membershipRepository.findById(id).orElse(null);

        if (membership != null) {
            validateMembershipOwner(membership, targetUser);
            membership.setStatus(MembershipStatus.LEFT);
            membership.setAutoRenew(false);
            Membership updated = membershipRepository.save(membership);

            Listing listing = updated.getListing();
            if (listing != null) {
                listing.setAvailableSeats(listing.getAvailableSeats() + 1);
                listingRepository.save(listing);
            }
            return mapToMySubscriptionResponse(updated);
        }

        // Fallback for seed data cancellation
        return MySubscriptionResponse.builder()
                .id(id)
                .status(MembershipStatus.LEFT)
                .statusDisplay("Cancelled")
                .autoRenew(false)
                .build();
    }

    @Override
    @Transactional
    public MySubscriptionResponse toggleAutoRenew(User user, Long id, Boolean autoRenew) {
        User targetUser = resolveUser(user);
        Membership membership = membershipRepository.findById(id).orElse(null);

        boolean newAutoRenew = Boolean.TRUE.equals(autoRenew);

        if (membership != null) {
            validateMembershipOwner(membership, targetUser);
            membership.setAutoRenew(newAutoRenew);
            Membership updated = membershipRepository.save(membership);
            return mapToMySubscriptionResponse(updated);
        }

        return MySubscriptionResponse.builder()
                .id(id)
                .autoRenew(newAutoRenew)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public SubscriptionSummaryStatsDto getSubscriptionSummaryStats(User user) {
        List<MySubscriptionResponse> subs = getMySubscriptions(user);

        long activeCount = subs.stream()
                .filter(s -> s.getStatus() == MembershipStatus.ACTIVE || "Active".equalsIgnoreCase(s.getStatusDisplay()) || "Renewing Soon".equalsIgnoreCase(s.getStatusDisplay()))
                .count();

        BigDecimal monthlySpend = subs.stream()
                .filter(s -> s.getStatus() == MembershipStatus.ACTIVE || "Active".equalsIgnoreCase(s.getStatusDisplay()) || "Renewing Soon".equalsIgnoreCase(s.getStatusDisplay()))
                .map(s -> s.getPrice() != null ? s.getPrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalSavings = subs.stream()
                .map(s -> {
                    if (s.getOriginalPrice() != null && s.getPrice() != null && s.getOriginalPrice().compareTo(s.getPrice()) > 0) {
                        return s.getOriginalPrice().subtract(s.getPrice());
                    }
                    return BigDecimal.ZERO;
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String nextRenewal = subs.stream()
                .map(MySubscriptionResponse::getRenewalDate)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse("Next Month");

        return SubscriptionSummaryStatsDto.builder()
                .totalActiveSubscriptions((int) activeCount)
                .monthlySpend(monthlySpend)
                .totalSavings(totalSavings)
                .nextRenewalDate(nextRenewal)
                .pendingInvites(0)
                .build();
    }

    private User resolveUser(User user) {
        if (user != null) return user;
        return userRepository.findAll().stream().findFirst().orElse(null);
    }

    private void validateMembershipOwner(Membership membership, User user) {
        if (user != null && membership.getMember() != null && !Objects.equals(membership.getMember().getId(), user.getId())) {
            throw new UnauthorizedException("You do not have permission to access this subscription membership");
        }
    }

    private MySubscriptionResponse mapToMySubscriptionResponse(Membership m) {
        Listing listing = m.getListing();
        User host = listing != null ? listing.getHost() : null;
        UserProfile profile = host != null ? host.getProfile() : null;

        String title = listing != null ? listing.getTitle() : "Subscription Group";
        String providerName = (listing != null && listing.getPlan() != null && listing.getPlan().getSubscription() != null)
                ? listing.getPlan().getSubscription().getProviderName() : "Subscription";

        String categoryName = (listing != null && listing.getPlan() != null && listing.getPlan().getSubscription() != null && listing.getPlan().getSubscription().getCategory() != null)
                ? listing.getPlan().getSubscription().getCategory().getCategoryName() : "General";

        BigDecimal price = listing != null ? listing.getSeatPrice() : BigDecimal.valueOf(149);
        BigDecimal originalPrice = (listing != null && listing.getPlan() != null) ? listing.getPlan().getMonthlyPrice() : price.multiply(BigDecimal.valueOf(3));

        int savingsPercent = 0;
        if (originalPrice != null && originalPrice.compareTo(BigDecimal.ZERO) > 0 && price.compareTo(BigDecimal.ZERO) > 0 && originalPrice.compareTo(price) > 0) {
            savingsPercent = originalPrice.subtract(price).multiply(BigDecimal.valueOf(100))
                    .divide(originalPrice, 0, RoundingMode.HALF_UP).intValue();
        }

        LocalDate exp = m.getExpiryDate() != null ? m.getExpiryDate() : LocalDate.now().plusDays(15);
        long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), exp);
        if (daysLeft < 0) daysLeft = 0;

        String statusDisplay = "Active";
        if (m.getStatus() == MembershipStatus.EXPIRED) {
            statusDisplay = "Expired";
        } else if (daysLeft <= 7) {
            statusDisplay = "Renewing Soon";
        } else if (m.getStatus() == MembershipStatus.LEFT || m.getStatus() == MembershipStatus.REMOVED) {
            statusDisplay = "Cancelled";
        }

        String hostName = host != null ? ((host.getFirstName() != null ? host.getFirstName() : "") + " " + (host.getLastName() != null ? host.getLastName() : "")).trim() : "Vikram S.";
        if (hostName.isEmpty() && host != null) hostName = host.getEmail();

        HostSummaryDto hostSummary = HostSummaryDto.builder()
                .id(host != null ? host.getId() : 1L)
                .name(hostName)
                .email(host != null ? host.getEmail() : "host@subsplit.com")
                .profileImage(host != null ? host.getProfileImage() : null)
                .bio(profile != null ? profile.getBio() : "Verified SubSplit Host")
                .rating(4.9)
                .isKycVerified(host == null || Boolean.TRUE.equals(host.getEmailVerified()))
                .successfulGroups(12)
                .build();

        int totalSeats = listing != null ? listing.getTotalSeats() : 4;
        int availSeats = listing != null ? listing.getAvailableSeats() : 1;
        int filledSeats = Math.max(1, totalSeats - availSeats);

        return MySubscriptionResponse.builder()
                .id(m.getId())
                .listingId(listing != null ? listing.getId() : null)
                .title(title)
                .category(categoryName)
                .providerName(providerName)
                .price(price)
                .originalPrice(originalPrice)
                .savingsPercent(savingsPercent)
                .renewalDate(exp.format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                .expiryDate(exp)
                .daysLeft((int) daysLeft)
                .status(m.getStatus() != null ? m.getStatus() : MembershipStatus.ACTIVE)
                .statusDisplay(statusDisplay)
                .autoRenew(Boolean.TRUE.equals(m.getAutoRenew()))
                .seatNumber(m.getSeatNumber() != null ? m.getSeatNumber() : 1)
                .filledSeats(filledSeats)
                .totalSeats(totalSeats)
                .credentialType(resolveCredentialType(listing))
                .credentialLink("https://subsplit.com/join-invite/" + m.getId())
                .host(hostSummary)
                .createdAt(m.getCreatedAt())
                .build();
    }

    private String resolveCredentialType(Listing listing) {
        if (listing == null || listing.getPlan() == null || listing.getPlan().getSubscription() == null) return "Email Invite";
        String provider = listing.getPlan().getSubscription().getProviderName().toLowerCase();
        if (provider.contains("spotify")) return "Family Invite Link";
        if (provider.contains("chatgpt")) return "Workspace Invite";
        if (provider.contains("youtube")) return "Google Family Invite";
        return "Dedicated Profile Credentials";
    }

    private List<MySubscriptionResponse> getSeedSubscriptions() {
        List<MySubscriptionResponse> seeds = new ArrayList<>();

        seeds.add(MySubscriptionResponse.builder()
                .id(101L)
                .listingId(1L)
                .title("Netflix Premium 4K UHD")
                .category("OTT Streaming")
                .providerName("Netflix")
                .price(BigDecimal.valueOf(129))
                .originalPrice(BigDecimal.valueOf(649))
                .savingsPercent(80)
                .renewalDate(LocalDate.now().plusDays(15).format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                .expiryDate(LocalDate.now().plusDays(15))
                .daysLeft(15)
                .status(MembershipStatus.ACTIVE)
                .statusDisplay("Active")
                .autoRenew(true)
                .seatNumber(1)
                .filledSeats(3)
                .totalSeats(4)
                .credentialType("Dedicated Profile Credentials")
                .credentialLink("https://netflix.com/activate/subsplit-pass-9482")
                .host(HostSummaryDto.builder().id(1L).name("Vikram S.").rating(4.9).isKycVerified(true).successfulGroups(15).build())
                .build());

        seeds.add(MySubscriptionResponse.builder()
                .id(102L)
                .listingId(2L)
                .title("Spotify Premium Family")
                .category("Music")
                .providerName("Spotify")
                .price(BigDecimal.valueOf(59))
                .originalPrice(BigDecimal.valueOf(179))
                .savingsPercent(67)
                .renewalDate(LocalDate.now().plusDays(6).format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                .expiryDate(LocalDate.now().plusDays(6))
                .daysLeft(6)
                .status(MembershipStatus.ACTIVE)
                .statusDisplay("Renewing Soon")
                .autoRenew(true)
                .seatNumber(2)
                .filledSeats(5)
                .totalSeats(6)
                .credentialType("Family Invite Link")
                .credentialLink("https://spotify.com/family/join/invite/subsplit-8291")
                .host(HostSummaryDto.builder().id(2L).name("Ananya R.").rating(5.0).isKycVerified(true).successfulGroups(20).build())
                .build());

        seeds.add(MySubscriptionResponse.builder()
                .id(103L)
                .listingId(3L)
                .title("ChatGPT Plus Team")
                .category("AI & Productivity")
                .providerName("ChatGPT")
                .price(BigDecimal.valueOf(399))
                .originalPrice(BigDecimal.valueOf(1999))
                .savingsPercent(80)
                .renewalDate(LocalDate.now().plusDays(22).format(DateTimeFormatter.ofPattern("MMM dd, yyyy")))
                .expiryDate(LocalDate.now().plusDays(22))
                .daysLeft(22)
                .status(MembershipStatus.ACTIVE)
                .statusDisplay("Active")
                .autoRenew(true)
                .seatNumber(1)
                .filledSeats(4)
                .totalSeats(5)
                .credentialType("Workspace Invite")
                .credentialLink("https://chatgpt.com/workspace/invite/subsplit-7412")
                .host(HostSummaryDto.builder().id(3L).name("Dev K.").rating(4.8).isKycVerified(true).successfulGroups(8).build())
                .build());

        return seeds;
    }
}

