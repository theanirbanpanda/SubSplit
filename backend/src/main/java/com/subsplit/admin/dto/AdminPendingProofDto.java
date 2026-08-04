package com.subsplit.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminPendingProofDto {
    private Long id;
    private Long listingId;
    private String listingTitle;
    private String platformName;
    private Long hostId;
    private String hostName;
    private Long memberId;
    private String memberName;
    private String memberEmail;
    private BigDecimal amount;
    private String status;
    private String shareType;
    private String invitationLink;
    private String activationCode;
    private String credentialsUsername;
    private String credentialsPassword;
    private String credentialsNotes;
    private String proofImage;
    private LocalDateTime createdAt;
    private LocalDateTime credentialsSharedAt;
}
