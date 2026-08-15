package com.subsplit.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductRequestDto {

    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Product name must be under 255 characters")
    private String productName;

    @Size(max = 255)
    private String category;

    @Size(max = 255)
    private String websiteUrl;

    @Size(max = 1000, message = "Description must be under 1000 characters")
    private String description;
}
