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
public class AdminUserListingDto {
    private Long id;
    private String title;
    private String platformName;
    private BigDecimal price;
    private Integer totalSeats;
    private Integer availableSeats;
    private String status;
    private LocalDate startDate;
}
