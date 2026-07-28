package com.subsplit.marketplace.dto;

import com.subsplit.common.enums.BillingCycle;
import jakarta.validation.constraints.*;

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

    @NotBlank(message = "Provider name is required")
    private String providerName;

    private String planName;

    private String categoryName;

    @NotBlank(message = "Listing title is required")
    @Size(min = 3, max = 100, message = "Listing title must be between 3 and 100 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Seat price is required")
    @DecimalMin(value = "1.00", message = "Seat price must be at least ₹1")
    @DecimalMax(value = "50000.00", message = "Seat price cannot exceed ₹50,000")
    private BigDecimal seatPrice;

    @NotNull(message = "Total seats is required")
    @Min(value = 1, message = "Total seats must be at least 1")
    @Max(value = 50, message = "Total seats cannot exceed 50")
    private Integer totalSeats;

    @Min(value = 1, message = "Available seats must be at least 1")
    @Max(value = 50, message = "Available seats cannot exceed 50")
    private Integer availableSeats;

    private BillingCycle billingCycle;

    private LocalDate startDate;

    private LocalDate expiryDate;
}

