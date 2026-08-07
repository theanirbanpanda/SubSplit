package com.subsplit.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsDto {
    private Long totalUsersCount;
    private Long totalListingsCount;
    private Long activeListingsCount;
    private Long totalJoinRequestsCount;
    private Long approvedRequestsCount;

    private BigDecimal totalGrossVolume;
    private BigDecimal totalPlatformRevenue;
    private BigDecimal currentEscrowReserve;

    private Double aiVerificationSuccessRate;
    private String avgSettlementSpeed;

    private List<CategoryShareDto> categoryShares;
    private List<MonthlyTrendDto> monthlyTrends;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryShareDto {
        private String categoryName;
        private Long listingCount;
        private Double percentage;
        private String color;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyTrendDto {
        private String month;
        private BigDecimal volume;
        private BigDecimal revenue;
        private Integer newUsers;
    }
}
