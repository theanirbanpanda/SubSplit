package com.subsplit.listing.repository;

import com.subsplit.listing.entity.JoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface JoinRequestRepository extends JpaRepository<JoinRequest, Long> {
    Optional<JoinRequest> findByListingIdAndMemberId(Long listingId, Long memberId);

    List<JoinRequest> findByListingId(Long listingId);

    @Query("SELECT j FROM JoinRequest j WHERE j.member.id = :memberId ORDER BY j.createdAt DESC")
    List<JoinRequest> findByMemberIdOrderByCreatedAtDesc(@Param("memberId") Long memberId);

    boolean existsByListingIdAndMemberId(Long listingId, Long memberId);
}



