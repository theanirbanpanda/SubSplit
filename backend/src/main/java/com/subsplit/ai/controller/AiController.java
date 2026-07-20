package com.subsplit.ai.controller;

import com.subsplit.ai.entity.AiValidationLog;
import com.subsplit.ai.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @GetMapping("/logs")
    public List<AiValidationLog> getAllLogs() {
        return aiService.getAllLogs();
    }
}
