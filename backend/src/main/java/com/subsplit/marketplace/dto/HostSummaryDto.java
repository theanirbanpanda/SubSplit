package com.subsplit.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HostSummaryDto {

    private Long id;
    private String name;
    private String email;
    private String profileImage;
    private String bio;
    private Double rating;
    private Boolean isKycVerified;
    private Integer successfulGroups;
}
