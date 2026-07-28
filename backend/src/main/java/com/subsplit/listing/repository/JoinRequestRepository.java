package com.subsplit.listing.repository;

import com.subsplit.listing.entity.JoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JoinRequestRepository extends JpaRepository<JoinRequest, Long> {
    Optional<JoinRequest> findByListingIdAndMemberId(Long listingId, Long memberId);

    List<JoinRequest> findByListingId(Long listingId);

    boolean existsByListingIdAndMemberId(Long listingId, Long memberId);
}

