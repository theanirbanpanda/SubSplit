package com.subsplit.dispute.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RaiseDisputeRequest {
    private Long listingId;
    private Long joinRequestId;
    private String reason;
    private String description;
    private String proofImage;
}
