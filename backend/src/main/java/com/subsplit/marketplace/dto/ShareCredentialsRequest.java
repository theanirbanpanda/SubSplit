package com.subsplit.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShareCredentialsRequest {

    @NotBlank(message = "Username/email is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    private String notes;
}
