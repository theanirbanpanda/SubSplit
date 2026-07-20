package com.subsplit.dispute.service.impl;

import com.subsplit.dispute.entity.Dispute;
import com.subsplit.dispute.repository.DisputeRepository;
import com.subsplit.dispute.service.DisputeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DisputeServiceImpl implements DisputeService {

    private final DisputeRepository disputeRepository;

    @Override
    public List<Dispute> getAllDisputes() {
        return disputeRepository.findAll();
    }
}
