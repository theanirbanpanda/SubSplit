package com.subsplit.message.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReactMessageRequest {
    private Long messageId;
    @NotBlank
    @Size(max = 10)
    private String emoji;
}
