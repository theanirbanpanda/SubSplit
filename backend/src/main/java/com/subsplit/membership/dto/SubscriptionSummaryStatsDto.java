package com.subsplit.membership.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionSummaryStatsDto {

    private Integer totalActiveSubscriptions;
    private BigDecimal monthlySpend;
    private BigDecimal totalSavings;
    private String nextRenewalDate;
    private Integer pendingInvites;
}
