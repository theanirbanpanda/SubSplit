package com.subsplit.membership.repository;

import com.subsplit.membership.entity.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
    List<Membership> findByListingId(Long listingId);

    List<Membership> findByMemberId(Long memberId);

    List<Membership> findByMemberIdOrderByCreatedAtDesc(Long memberId);

    List<Membership> findByMemberIdAndStatus(Long memberId, com.subsplit.common.enums.MembershipStatus status);

    long countByMemberIdAndStatus(Long memberId, com.subsplit.common.enums.MembershipStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT m.listing.id FROM Membership m WHERE m.member.id = :memberId AND m.listing.id IS NOT NULL")
    List<Long> findListingIdsByMemberId(@org.springframework.data.repository.query.Param("memberId") Long memberId);

    java.util.Optional<Membership> findByMemberIdAndListingId(Long memberId, Long listingId);
}



