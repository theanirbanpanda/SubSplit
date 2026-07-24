package com.subsplit.common.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ErrorResponse {

    private int status;

    private String error;

    private String message;

    private List<String> validationErrors;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

}
