package com.subsplit.catalog.service.impl;

import com.subsplit.subscription.entity.Subscription;
import com.subsplit.subscription.repository.SubscriptionRepository;
import com.subsplit.catalog.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogServiceImpl implements CatalogService {

    private final SubscriptionRepository subscriptionRepository;

    @Override
    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    @Override
    public byte[] getSubscriptionLogo(Long id) {
        return subscriptionRepository.findById(id)
                .map(Subscription::getLogoData)
                .orElse(null);
    }
}
