package com.subsplit.marketplace.dto;

import com.subsplit.common.enums.BillingCycle;
import com.subsplit.common.enums.ListingStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateListingRequest {

    private String title;

    private String description;

    @DecimalMin(value = "0.01", message = "Seat price must be greater than 0")
    private BigDecimal seatPrice;

    @Min(value = 1, message = "Available seats cannot be negative")
    private Integer availableSeats;

    private BillingCycle billingCycle;

    private ListingStatus status;
}
