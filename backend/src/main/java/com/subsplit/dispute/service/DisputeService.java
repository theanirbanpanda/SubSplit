package com.subsplit.dispute.service;

import com.subsplit.common.entity.User;
import com.subsplit.dispute.dto.DisputeResponse;
import com.subsplit.dispute.dto.RaiseDisputeRequest;
import com.subsplit.dispute.dto.ResolveDisputeRequest;

import java.util.List;

public interface DisputeService {

    DisputeResponse raiseDispute(User user, RaiseDisputeRequest request);

    List<DisputeResponse> getUserDisputes(User user);

    List<DisputeResponse> getAllDisputesAdmin();

    DisputeResponse resolveDisputeAdmin(User admin, Long disputeId, ResolveDisputeRequest request);
}
