package com.subsplit.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KycStatusResponse {
    private Long userId;
    private Boolean isKycVerified;
    private String kycStatus;
    private String documentType;
    private String message;
    private LocalDateTime verifiedAt;
}
