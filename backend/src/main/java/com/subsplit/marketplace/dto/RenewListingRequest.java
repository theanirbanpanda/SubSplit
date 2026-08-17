package com.subsplit.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RenewListingRequest {

    @NotBlank(message = "Renewal proof image is required")
    private String proofImage;
    
    @NotNull(message = "New expiry date is required")
    private LocalDate newExpiryDate;
}
