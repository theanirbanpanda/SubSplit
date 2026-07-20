package com.subsplit.analytics.service;

import com.subsplit.analytics.entity.AnalyticsEvent;

import java.util.List;

public interface AnalyticsService {

    List<AnalyticsEvent> getAllEvents();

}
