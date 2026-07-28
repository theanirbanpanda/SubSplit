package com.subsplit.membership.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CredentialResponseDto {

    private Long membershipId;
    private String credentialType;
    private String inviteLink;
    private String username;
    private String password;
    private String instructions;
    private Boolean isEscrowProtected;
}
