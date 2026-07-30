package com.subsplit.dispute.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResolveDisputeRequest {
    private String action; // REFUND_MEMBER or REJECT_DISPUTE
    private String resolutionNotes;
}
