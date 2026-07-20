package com.subsplit.ai.repository;

import com.subsplit.ai.entity.AiValidationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AiValidationLogRepository extends JpaRepository<AiValidationLog, Long> {

}
