package com.subsplit.membership.controller;

import com.subsplit.common.dto.ApiResponse;
import com.subsplit.common.entity.User;
import com.subsplit.membership.dto.*;
import com.subsplit.membership.entity.Membership;
import com.subsplit.membership.service.MembershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/memberships")
@RequiredArgsConstructor
public class MembershipController {

    private final MembershipService membershipService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Membership>>> getAllMemberships() {
        return ResponseEntity.ok(ApiResponse.success("Memberships fetched successfully", membershipService.getAllMemberships()));
    }

    @GetMapping("/my-subscriptions")
    public ResponseEntity<ApiResponse<List<MySubscriptionResponse>>> getMySubscriptions(Authentication authentication) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        List<MySubscriptionResponse> response = membershipService.getMySubscriptions(currentUser);
        return ResponseEntity.ok(ApiResponse.success("User subscriptions retrieved successfully", response));
    }

    @GetMapping("/my-subscriptions/{id}")
    public ResponseEntity<ApiResponse<MySubscriptionResponse>> getMySubscriptionById(
            Authentication authentication,
            @PathVariable Long id) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        MySubscriptionResponse response = membershipService.getMySubscriptionById(currentUser, id);
        return ResponseEntity.ok(ApiResponse.success("Subscription detail retrieved successfully", response));
    }

    @GetMapping("/my-subscriptions/{id}/credentials")
    public ResponseEntity<ApiResponse<CredentialResponseDto>> getMembershipCredentials(
            Authentication authentication,
            @PathVariable Long id) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        CredentialResponseDto response = membershipService.getMembershipCredentials(currentUser, id);
        return ResponseEntity.ok(ApiResponse.success("Membership credentials retrieved successfully", response));
    }

    @PostMapping("/my-subscriptions/{id}/cancel")
    public ResponseEntity<ApiResponse<MySubscriptionResponse>> cancelSubscription(
            Authentication authentication,
            @PathVariable Long id) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        MySubscriptionResponse response = membershipService.cancelSubscription(currentUser, id);
        return ResponseEntity.ok(ApiResponse.success("Subscription cancelled successfully", response));
    }

    @PutMapping("/my-subscriptions/{id}/auto-renew")
    public ResponseEntity<ApiResponse<MySubscriptionResponse>> toggleAutoRenew(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody AutoRenewToggleRequest request) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        Boolean autoRenew = request != null ? request.getAutoRenew() : true;
        MySubscriptionResponse response = membershipService.toggleAutoRenew(currentUser, id, autoRenew);
        return ResponseEntity.ok(ApiResponse.success("Auto-renew setting updated successfully", response));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<SubscriptionSummaryStatsDto>> getSubscriptionSummaryStats(Authentication authentication) {
        User currentUser = getAuthenticatedUserOptional(authentication);
        SubscriptionSummaryStatsDto response = membershipService.getSubscriptionSummaryStats(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Subscription summary stats retrieved successfully", response));
    }

    private User getAuthenticatedUserOptional(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            return null;
        }
        return user;
    }
}

