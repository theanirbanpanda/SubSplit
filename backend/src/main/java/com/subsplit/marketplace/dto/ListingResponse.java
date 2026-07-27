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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListingResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal seatPrice;
    private Integer totalSeats;
    private Integer availableSeats;
    private BillingCycle billingCycle;
    private ListingStatus status;
    private LocalDate startDate;
    private LocalDate expiryDate;
    private LocalDateTime createdAt;
    private Integer savingsPercent;

    private Boolean isVerifiedHost;
    private Boolean isAiVerified;
    private Boolean isEscrowProtected;

    private HostSummaryDto host;
    private SubscriptionSummaryDto subscription;
    private SubscriptionPlanSummaryDto plan;
}
