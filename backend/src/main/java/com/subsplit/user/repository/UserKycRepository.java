package com.subsplit.user.repository;

import com.subsplit.user.entity.UserKyc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserKycRepository extends JpaRepository<UserKyc, Long> {

    Optional<UserKyc> findByUserId(Long userId);

}
