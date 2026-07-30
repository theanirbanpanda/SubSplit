package com.subsplit.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserSummaryDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String role;
    private Boolean isActive;
    private Integer activeListingsCount;
    private BigDecimal walletBalance;
    private LocalDateTime createdAt;
}
