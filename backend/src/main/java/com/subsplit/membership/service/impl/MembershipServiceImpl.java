package com.subsplit.membership.service.impl;

import com.subsplit.membership.entity.Membership;
import com.subsplit.membership.repository.MembershipRepository;
import com.subsplit.membership.service.MembershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MembershipServiceImpl implements MembershipService {

    private final MembershipRepository membershipRepository;

    @Override
    public List<Membership> getAllMemberships() {
        return membershipRepository.findAll();
    }
}
