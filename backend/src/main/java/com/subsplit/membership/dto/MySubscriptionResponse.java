package com.subsplit.membership.dto;

import com.subsplit.common.enums.MembershipStatus;
import com.subsplit.marketplace.dto.HostSummaryDto;

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
public class MySubscriptionResponse {

    private Long id;
    private Long listingId;
    private String title;
    private String category;
    private String providerName;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer savingsPercent;
    private String renewalDate;
    private LocalDate expiryDate;
    private Integer daysLeft;
    private MembershipStatus status;
    private String statusDisplay;
    private Boolean autoRenew;
    private Integer seatNumber;
    private Integer filledSeats;
    private Integer totalSeats;
    private String credentialType;
    private String credentialLink;
    private HostSummaryDto host;
    private LocalDateTime createdAt;
}
