package com.subsplit.catalog.service;

import com.subsplit.subscription.entity.Subscription;

import java.util.List;

public interface CatalogService {

    List<Subscription> getAllSubscriptions();
    byte[] getSubscriptionLogo(Long id);

}
