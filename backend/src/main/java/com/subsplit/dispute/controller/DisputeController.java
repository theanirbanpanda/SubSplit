package com.subsplit.dispute.controller;

import com.subsplit.dispute.entity.Dispute;
import com.subsplit.dispute.service.DisputeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disputes")
@RequiredArgsConstructor
public class DisputeController {

    private final DisputeService disputeService;

    @GetMapping
    public List<Dispute> getAllDisputes() {
        return disputeService.getAllDisputes();
    }
}
