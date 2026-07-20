package com.subsplit.marketplace.controller;

import com.subsplit.listing.entity.Listing;
import com.subsplit.marketplace.service.MarketplaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {

    private final MarketplaceService marketplaceService;

    @GetMapping("/listings")
    public List<Listing> getAllListings() {
        return marketplaceService.getAllListings();
    }
}
