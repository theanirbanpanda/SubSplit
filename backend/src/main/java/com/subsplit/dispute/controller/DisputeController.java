package com.subsplit.dispute.controller;

import com.subsplit.common.entity.User;
import com.subsplit.dispute.dto.DisputeResponse;
import com.subsplit.dispute.dto.RaiseDisputeRequest;
import com.subsplit.dispute.dto.ResolveDisputeRequest;
import com.subsplit.dispute.service.DisputeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DisputeController {

    private final DisputeService disputeService;

    // --- USER DISPUTE ENDPOINTS ---
    @PostMapping({"/api/v1/disputes", "/disputes"})
    public ResponseEntity<DisputeResponse> raiseDispute(
            @AuthenticationPrincipal User user,
            @RequestBody RaiseDisputeRequest request) {
        return ResponseEntity.ok(disputeService.raiseDispute(user, request));
    }

    @GetMapping({"/api/v1/disputes/my", "/disputes/my"})
    public ResponseEntity<List<DisputeResponse>> getUserDisputes(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(disputeService.getUserDisputes(user));
    }

    // --- ADMIN DISPUTE ENDPOINTS ---
    @GetMapping({"/api/v1/admin/disputes", "/api/admin/disputes", "/admin/disputes"})
    public ResponseEntity<List<DisputeResponse>> getAllDisputesAdmin() {
        return ResponseEntity.ok(disputeService.getAllDisputesAdmin());
    }

    @PostMapping({"/api/v1/admin/disputes/{id}/resolve", "/api/admin/disputes/{id}/resolve", "/admin/disputes/{id}/resolve"})
    public ResponseEntity<DisputeResponse> resolveDisputeAdmin(
            @AuthenticationPrincipal User admin,
            @PathVariable Long id,
            @RequestBody ResolveDisputeRequest request) {
        return ResponseEntity.ok(disputeService.resolveDisputeAdmin(admin, id, request));
    }
}
