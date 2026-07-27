package com.subsplit.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionSummaryDto {

    private Long id;
    private String providerName;
    private String logoUrl;
    private String officialWebsite;
    private Long categoryId;
    private String categoryName;
}
