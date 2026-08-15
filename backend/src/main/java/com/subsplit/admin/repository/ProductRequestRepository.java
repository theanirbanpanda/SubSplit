package com.subsplit.admin.repository;

import com.subsplit.admin.entity.ProductRequest;
import com.subsplit.common.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRequestRepository extends JpaRepository<ProductRequest, Long> {

    List<ProductRequest> findAllByOrderByCreatedAtDesc();

    List<ProductRequest> findByUserOrderByCreatedAtDesc(User user);
}
