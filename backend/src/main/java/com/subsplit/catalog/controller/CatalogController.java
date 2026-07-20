package com.subsplit.catalog.controller;

import com.subsplit.subscription.entity.Subscription;
import com.subsplit.catalog.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalog")
@RequiredArgsConstructor
public class CatalogController {

    private final CatalogService catalogService;

    @GetMapping("/subscriptions")
    public List<Subscription> getAllSubscriptions() {
        return catalogService.getAllSubscriptions();
    }
}
