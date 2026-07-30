package com.subsplit.admin.controller;

import com.subsplit.admin.dto.AdminListingSummaryDto;
import com.subsplit.admin.dto.AdminPendingProofDto;
import com.subsplit.admin.dto.AdminUserDetailDto;
import com.subsplit.admin.dto.AdminUserSummaryDto;
import com.subsplit.admin.entity.AdminLog;
import com.subsplit.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1/admin", "/api/admin", "/admin"})
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/logs")
    public List<AdminLog> getAllLogs() {
        return adminService.getAllLogs();
    }

    @GetMapping("/analytics")
    public ResponseEntity<com.subsplit.admin.dto.AdminAnalyticsDto> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }


    // --- USER MANAGEMENT ---
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserSummaryDto>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<AdminUserDetailDto> getUserDetails(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserDetails(id));
    }

    @PatchMapping("/users/{id}/toggle-block")
    public ResponseEntity<AdminUserSummaryDto> toggleBlockUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleBlockUser(id));
    }

    // --- LISTING MANAGEMENT ---
    @GetMapping("/listings")
    public ResponseEntity<List<AdminListingSummaryDto>> getAllListings() {
        return ResponseEntity.ok(adminService.getAllListings());
    }

    @PatchMapping("/listings/{id}/status")
    public ResponseEntity<AdminListingSummaryDto> updateListingStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(adminService.updateListingStatus(id, status));
    }

    @DeleteMapping("/listings/{id}")
    public ResponseEntity<Map<String, String>> deleteListing(@PathVariable Long id) {
        adminService.deleteListing(id);
        return ResponseEntity.ok(Map.of("message", "Listing #" + id + " deleted successfully."));
    }

    // --- PROOF VERIFICATION & ESCROW SETTLEMENT ---
    @GetMapping("/pending-proofs")
    public ResponseEntity<List<AdminPendingProofDto>> getPendingProofs() {
        return ResponseEntity.ok(adminService.getPendingProofs());
    }

    @PostMapping("/join-requests/{requestId}/verify-and-settle")
    public ResponseEntity<Map<String, String>> verifyAndSettleJoinRequest(@PathVariable Long requestId) {
        adminService.verifyAndSettleJoinRequest(requestId);
        return ResponseEntity.ok(Map.of("message", "Proof verified & escrow funds released successfully for request #" + requestId));
    }

    @PostMapping("/join-requests/{requestId}/reject-proof")
    public ResponseEntity<Map<String, String>> rejectJoinRequestProof(
            @PathVariable Long requestId,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = (body != null && body.containsKey("reason")) ? body.get("reason") : "Proof rejected by admin.";
        adminService.rejectJoinRequestProof(requestId, reason);
        return ResponseEntity.ok(Map.of("message", "Proof rejected for request #" + requestId));
    }
}
