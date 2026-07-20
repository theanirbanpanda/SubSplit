package com.subsplit.listing.repository;

import com.subsplit.listing.entity.OwnershipProof;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OwnershipProofRepository extends JpaRepository<OwnershipProof, Long> {

}
