package com.subsplit.marketplace.service.impl;

import com.subsplit.listing.entity.Listing;
import com.subsplit.listing.repository.ListingRepository;
import com.subsplit.marketplace.service.MarketplaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketplaceServiceImpl implements MarketplaceService {

    private final ListingRepository listingRepository;

    @Override
    public List<Listing> getAllListings() {
        return listingRepository.findAll();
    }
}
