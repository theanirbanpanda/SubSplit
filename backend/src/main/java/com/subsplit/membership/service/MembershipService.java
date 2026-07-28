package com.subsplit.membership.service;

import com.subsplit.common.entity.User;
import com.subsplit.membership.dto.*;
import com.subsplit.membership.entity.Membership;

import java.util.List;

public interface MembershipService {

    List<Membership> getAllMemberships();

    List<MySubscriptionResponse> getMySubscriptions(User user);

    MySubscriptionResponse getMySubscriptionById(User user, Long id);

    CredentialResponseDto getMembershipCredentials(User user, Long id);

    MySubscriptionResponse cancelSubscription(User user, Long id);

    MySubscriptionResponse toggleAutoRenew(User user, Long id, Boolean autoRenew);

    SubscriptionSummaryStatsDto getSubscriptionSummaryStats(User user);
}

