package com.subsplit.analytics.service.impl;

import com.subsplit.analytics.entity.AnalyticsEvent;
import com.subsplit.analytics.repository.AnalyticsEventRepository;
import com.subsplit.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final AnalyticsEventRepository analyticsEventRepository;

    @Override
    public List<AnalyticsEvent> getAllEvents() {
        return analyticsEventRepository.findAll();
    }
}
