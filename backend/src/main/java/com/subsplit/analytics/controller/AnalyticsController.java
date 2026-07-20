package com.subsplit.analytics.controller;

import com.subsplit.analytics.entity.AnalyticsEvent;
import com.subsplit.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/events")
    public List<AnalyticsEvent> getAllEvents() {
        return analyticsService.getAllEvents();
    }
}
