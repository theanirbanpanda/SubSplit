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
    Optional<JoinRequest> findByMemberIdAndListingId(Long memberId, Long listingId);

    List<JoinRequest> findByListingId(Long listingId);

    @Query("SELECT j FROM JoinRequest j WHERE j.member.id = :memberId ORDER BY j.createdAt DESC")
    List<JoinRequest> findByMemberIdOrderByCreatedAtDesc(@Param("memberId") Long memberId);

    @Query("SELECT j FROM JoinRequest j WHERE j.listing.host.id = :hostId ORDER BY j.createdAt DESC")
    List<JoinRequest> findByHostIdOrderByCreatedAtDesc(@Param("hostId") Long hostId);

    @Query("SELECT DISTINCT j.listing.id FROM JoinRequest j WHERE j.member.id = :memberId AND j.status != com.subsplit.common.enums.JoinRequestStatus.REJECTED AND j.status != com.subsplit.common.enums.JoinRequestStatus.CANCELLED AND j.listing.id IS NOT NULL")
    List<Long> findListingIdsByMemberIdNonRejected(@Param("memberId") Long memberId);

    boolean existsByListingIdAndMemberId(Long listingId, Long memberId);
}





