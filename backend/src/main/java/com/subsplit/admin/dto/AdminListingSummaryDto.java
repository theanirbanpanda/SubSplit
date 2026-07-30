package com.subsplit.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminListingSummaryDto {
    private Long id;
    private String title;
    private String description;
    private String platformName;
    private Long hostId;
    private String hostName;
    private String hostEmail;
    private BigDecimal seatPrice;
    private BigDecimal monthlyPrice;
    private Integer totalSeats;
    private Integer availableSeats;
    private String status;
    private String billingCycle;
    private LocalDate startDate;
    private LocalDate expiryDate;
    private Integer activeRequestsCount;
}
