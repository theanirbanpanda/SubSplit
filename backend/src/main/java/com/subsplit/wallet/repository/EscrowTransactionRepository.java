package com.subsplit.wallet.repository;

import com.subsplit.wallet.entity.EscrowTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EscrowTransactionRepository extends JpaRepository<EscrowTransaction, Long> {

}
