package com.subsplit.marketplace.dto;

import com.subsplit.common.enums.BillingCycle;
import com.subsplit.common.enums.ListingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListingDetailResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal seatPrice;
    private BigDecimal monthlyPrice;
    private Integer totalSeats;
    private Integer availableSeats;
    private BillingCycle billingCycle;
    private ListingStatus status;
    private LocalDate startDate;
    private LocalDate expiryDate;
    private LocalDateTime createdAt;
    private Integer savingsPercent;

    // Trust & Verification Indicators
    private Boolean isVerifiedHost;
    private Boolean isAiVerified;
    private Boolean isEscrowProtected;
    private String aiProofType;
    private String aiValidationStatus;

    // Specification Details
    private String quality;
    private String supportedDevices;
    private String region;
    private String accessMethod;
    private String accountType;
    private String supportAvailability;
    private List<String> features;
    private List<String> rules;

    // Related Entities & Summaries
    private HostSummaryDto host;
    private SubscriptionSummaryDto subscription;
    private SubscriptionPlanSummaryDto plan;

    // Active Occupants & Members
    private List<OccupantDto> occupants;

    // Review Summary
    private ListingReviewResponse reviewSummary;
}
