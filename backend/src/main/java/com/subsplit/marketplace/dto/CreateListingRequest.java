package com.subsplit.marketplace.dto;

import com.subsplit.common.enums.BillingCycle;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateListingRequest {

    private Long planId;

    private String providerName;

    private String planName;

    private String categoryName;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Seat price is required")
    @DecimalMin(value = "0.01", message = "Seat price must be greater than 0")
    private BigDecimal seatPrice;

    @NotNull(message = "Total seats is required")
    @Min(value = 1, message = "Total seats must be at least 1")
    private Integer totalSeats;

    private Integer availableSeats;

    private BillingCycle billingCycle;

    private LocalDate startDate;

    private LocalDate expiryDate;
}
