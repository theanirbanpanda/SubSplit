package com.subsplit.listing.repository;

import com.subsplit.listing.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long>, JpaSpecificationExecutor<Listing> {

    List<Listing> findByHostId(Long hostId);

    List<Listing> findByHostIdAndStatus(Long hostId, com.subsplit.common.enums.ListingStatus status);

    List<Listing> findByPlanSubscriptionIdAndIdNot(Long subscriptionId, Long id);

    List<Listing> findByPlanSubscriptionCategoryIdAndIdNot(Long categoryId, Long id);

    List<Listing> findTop4ByPlanSubscriptionCategoryIdAndIdNotAndStatus(Long categoryId, Long id, com.subsplit.common.enums.ListingStatus status);

    List<Listing> findTop4ByIdNotAndStatus(Long id, com.subsplit.common.enums.ListingStatus status);
}


