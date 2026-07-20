package com.subsplit.membership.repository;

import com.subsplit.membership.entity.SubscriptionCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionCredentialRepository extends JpaRepository<SubscriptionCredential, Long> {

}
