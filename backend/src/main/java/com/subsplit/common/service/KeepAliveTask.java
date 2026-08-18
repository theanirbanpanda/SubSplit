package com.subsplit.common.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class KeepAliveTask {

    private static final Logger logger = LoggerFactory.getLogger(KeepAliveTask.class);
    private final RestTemplate restTemplate = new RestTemplate();

    // Cron expression: Run every 10 minutes (at 0, 10, 20, 30, 40, 50 minutes past the hour)
    @Scheduled(cron = "0 */10 * * * *")
    public void pingHealthCheckApi() {
        try {
            // Using localhost:8080 by default. For cloud deployments (like Render),
            // you might want to use the public URL if the goal is to prevent spin-down.
            String url = System.getenv("APP_URL");
            if (url == null || url.isBlank()) {
                url = "http://localhost:8080";
            }
            String healthUrl = url + "/api/v1/health";
            String response = restTemplate.getForObject(healthUrl, String.class);
            logger.info("Cron Job: Health check API called successfully. Response: {}", response);
        } catch (Exception e) {
            logger.error("Cron Job: Failed to call health check API: {}", e.getMessage());
        }
    }
}
