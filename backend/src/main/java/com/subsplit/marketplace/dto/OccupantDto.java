package com.subsplit.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OccupantDto {
    private Long id;
    private Integer seatNumber;
    private Long memberId;
    private String memberName;
    private String memberAvatar;
    private String memberInitials;
    private LocalDate joinedDate;
    private String status;
}
