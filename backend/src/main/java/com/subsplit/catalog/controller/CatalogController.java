package com.subsplit.catalog.controller;

import com.subsplit.subscription.entity.Subscription;
import com.subsplit.catalog.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping({"/api/v1/catalog", "/api/catalog"})
@RequiredArgsConstructor
public class CatalogController {

    private final CatalogService catalogService;

    @GetMapping("/subscriptions")
    public List<Subscription> getAllSubscriptions() {
        return catalogService.getAllSubscriptions();
    }

    @GetMapping("/subscriptions/{id}/logo")
    public ResponseEntity<byte[]> getSubscriptionLogo(@PathVariable Long id) {
        byte[] logoData = catalogService.getSubscriptionLogo(id);
        if (logoData == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "image/svg+xml")
                .header(HttpHeaders.CACHE_CONTROL, "max-age=86400, public")
                .body(logoData);
    }
}
