package com.subsplit.admin.dto;

import com.subsplit.common.enums.ProductRequestStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProductRequestResponseDto {

    private Long id;
    private Long userId;
    private String userEmail;
    private String userName;
    private String productName;
    private String category;
    private String websiteUrl;
    private String description;
    private ProductRequestStatus status;
    private String adminNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
