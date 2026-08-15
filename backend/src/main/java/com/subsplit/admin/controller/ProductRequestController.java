package com.subsplit.admin.controller;

import com.subsplit.admin.dto.ProductRequestDto;
import com.subsplit.admin.dto.ProductRequestResponseDto;
import com.subsplit.admin.service.ProductRequestService;
import com.subsplit.common.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/product-requests")
@RequiredArgsConstructor
public class ProductRequestController {

    private final ProductRequestService productRequestService;

    /**
     * User: submit a new product request.
     */
    @PostMapping
    public ResponseEntity<ProductRequestResponseDto> submitRequest(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ProductRequestDto dto) {
        return ResponseEntity.ok(productRequestService.submitRequest(user, dto));
    }

    /**
     * User: view their own requests.
     */
    @GetMapping("/my")
    public ResponseEntity<List<ProductRequestResponseDto>> getMyRequests(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(productRequestService.getMyRequests(user));
    }

    /**
     * Admin: view all product requests.
     */
    @GetMapping("/admin")
    public ResponseEntity<List<ProductRequestResponseDto>> getAllRequests() {
        return ResponseEntity.ok(productRequestService.getAllRequests());
    }

    /**
     * Admin: approve or reject a product request.
     * Body: { "status": "APPROVED" | "REJECTED", "adminNotes": "..." }
     */
    @PatchMapping("/admin/{id}/review")
    public ResponseEntity<ProductRequestResponseDto> reviewRequest(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "");
        String adminNotes = body.getOrDefault("adminNotes", "");
        return ResponseEntity.ok(productRequestService.reviewRequest(id, status, adminNotes));
    }
}
