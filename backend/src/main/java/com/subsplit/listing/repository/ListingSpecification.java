package com.subsplit.listing.repository;

import com.subsplit.common.enums.BillingCycle;
import com.subsplit.common.enums.ListingStatus;
import com.subsplit.listing.entity.Listing;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ListingSpecification {

    public static Specification<Listing> filterListings(
            Long excludeHostId,
            String search,
            String category,
            Long subscriptionId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            BillingCycle billingCycle,
            ListingStatus status,
            Boolean verifiedOnly
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Exclude listings created by the current logged-in user
            if (excludeHostId != null) {
                Join<Object, Object> hostJoin = root.join("host", JoinType.LEFT);
                predicates.add(cb.notEqual(hostJoin.get("id"), excludeHostId));
            }


            // Avoid duplicate rows when fetching joins
            if (query != null && Long.class != query.getResultType() && long.class != query.getResultType()) {
                root.fetch("host", JoinType.LEFT);
                root.fetch("plan", JoinType.LEFT);
            }

            // Status filter (only filter if status parameter is passed, otherwise include all non-cancelled listings)
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            } else {
                predicates.add(cb.or(
                        cb.isNull(root.get("status")),
                        cb.equal(root.get("status"), ListingStatus.ACTIVE)
                ));
            }

            // Search query across listing title, description, or subscription provider name
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";

                Join<Object, Object> planJoin = root.join("plan", JoinType.LEFT);
                Join<Object, Object> subJoin = planJoin.join("subscription", JoinType.LEFT);

                Predicate titleLike = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate descLike = cb.like(cb.lower(root.get("description")), searchPattern);
                Predicate providerLike = cb.like(cb.lower(subJoin.get("providerName")), searchPattern);

                predicates.add(cb.or(titleLike, descLike, providerLike));
            }

            // Category filter (by category name or id)
            if (category != null && !category.trim().isEmpty() && !"All".equalsIgnoreCase(category.trim())) {
                Join<Object, Object> planJoin = root.join("plan", JoinType.LEFT);
                Join<Object, Object> subJoin = planJoin.join("subscription", JoinType.LEFT);
                Join<Object, Object> catJoin = subJoin.join("category", JoinType.LEFT);

                predicates.add(cb.equal(cb.lower(catJoin.get("categoryName")), category.trim().toLowerCase()));
            }

            // Subscription provider filter by ID
            if (subscriptionId != null) {
                Join<Object, Object> planJoin = root.join("plan", JoinType.LEFT);
                Join<Object, Object> subJoin = planJoin.join("subscription", JoinType.LEFT);

                predicates.add(cb.equal(subJoin.get("id"), subscriptionId));
            }

            // Price range filters
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("seatPrice"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("seatPrice"), maxPrice));
            }

            // Billing cycle filter
            if (billingCycle != null) {
                predicates.add(cb.equal(root.get("billingCycle"), billingCycle));
            }

            // Verified host filter (KYC or Email verified)
            if (Boolean.TRUE.equals(verifiedOnly)) {
                Join<Object, Object> hostJoin = root.join("host", JoinType.LEFT);
                predicates.add(cb.equal(hostJoin.get("emailVerified"), true));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
