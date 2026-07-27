package com.subsplit.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPlanSummaryDto {

    private Long id;
    private String planName;
    private Integer maxMembers;
    private BigDecimal monthlyPrice;
    private BigDecimal yearlyPrice;
    private Boolean sharingAllowed;
}
