package com.subsplit.dispute.repository;

import com.subsplit.dispute.entity.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, Long> {

    @Query("SELECT d FROM Dispute d WHERE d.raisedBy.id = :userId ORDER BY d.createdAt DESC")
    List<Dispute> findByRaisedByIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT d FROM Dispute d ORDER BY d.createdAt DESC")
    List<Dispute> findAllByOrderByCreatedAtDesc();
}
