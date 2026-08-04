package com.subsplit.dispute.dto;

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
public class DisputeResponse {
    private Long id;
    private Long listingId;
    private String listingTitle;
    private String platformName;
    private Long joinRequestId;
    private Long raisedById;
    private String raisedByName;
    private String raisedByEmail;
    private Long againstUserId;
    private String againstUserName;
    private String againstUserEmail;
    private BigDecimal amount;
    private String reason;
    private String description;
    private String proofImage;
    private String status;
    private String resolutionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
