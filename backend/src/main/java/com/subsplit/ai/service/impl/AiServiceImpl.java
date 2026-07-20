package com.subsplit.ai.service.impl;

import com.subsplit.ai.entity.AiValidationLog;
import com.subsplit.ai.repository.AiValidationLogRepository;
import com.subsplit.ai.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {

    private final AiValidationLogRepository aiValidationLogRepository;

    @Override
    public List<AiValidationLog> getAllLogs() {
        return aiValidationLogRepository.findAll();
    }
}
