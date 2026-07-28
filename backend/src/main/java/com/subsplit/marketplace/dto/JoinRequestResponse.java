package com.subsplit.marketplace.dto;

import com.subsplit.common.enums.JoinRequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JoinRequestResponse {
    private Long id;
    private Long listingId;
    private Long memberId;
    private String memberName;
    private JoinRequestStatus status;
    private String message;
    private LocalDateTime createdAt;
}
