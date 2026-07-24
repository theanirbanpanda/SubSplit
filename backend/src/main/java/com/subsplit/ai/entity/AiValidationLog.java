package com.subsplit.ai.entity;

import com.subsplit.common.entity.BaseEntity;
import com.subsplit.common.enums.AiDecision;
import com.subsplit.common.enums.AiTaskType;
import com.subsplit.listing.entity.Listing;
import com.subsplit.common.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "ai_validation_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiValidationLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id")
    private Listing listing;

    @Enumerated(EnumType.STRING)
    private AiTaskType taskType;

    @Enumerated(EnumType.STRING)
    private AiDecision decision;

    private BigDecimal confidence;

    @Column(columnDefinition = "TEXT")
    private String aiResponse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

}
