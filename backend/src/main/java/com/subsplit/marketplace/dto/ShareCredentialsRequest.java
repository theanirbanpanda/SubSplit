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

    private String shareType; // "CREDENTIALS", "INVITATION_LINK", "ACTIVATION_CODE"
    private String username;
    private String password;
    private String invitationLink;
    private String activationCode;
    private String notes;
}
