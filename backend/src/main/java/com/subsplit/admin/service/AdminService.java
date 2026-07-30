package com.subsplit.admin.service;

import com.subsplit.admin.dto.AdminListingSummaryDto;
import com.subsplit.admin.dto.AdminPendingProofDto;
import com.subsplit.admin.dto.AdminUserDetailDto;
import com.subsplit.admin.dto.AdminUserSummaryDto;
import com.subsplit.admin.entity.AdminLog;

import java.util.List;

public interface AdminService {

    List<AdminLog> getAllLogs();

    List<AdminUserSummaryDto> getAllUsers();

    AdminUserDetailDto getUserDetails(Long userId);

    AdminUserSummaryDto toggleBlockUser(Long userId);

    List<AdminListingSummaryDto> getAllListings();

    AdminListingSummaryDto updateListingStatus(Long listingId, String status);

    void deleteListing(Long listingId);

    List<AdminPendingProofDto> getPendingProofs();

    void verifyAndSettleJoinRequest(Long requestId);

    void rejectJoinRequestProof(Long requestId, String reason);

    com.subsplit.admin.dto.AdminAnalyticsDto getAnalytics();
}

