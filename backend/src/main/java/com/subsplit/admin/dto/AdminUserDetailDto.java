package com.subsplit.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDetailDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String role;
    private Boolean isActive;
    private Boolean emailVerified;
    private LocalDateTime createdAt;
    private String profileImage;
    private String bio;
    private String city;
    private String state;
    private BigDecimal walletBalance;
    private BigDecimal escrowBalance;
    private List<AdminUserListingDto> listings;
    private List<AdminUserTransactionDto> transactions;
}
