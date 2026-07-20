package com.subsplit.listing.entity;

import com.subsplit.common.entity.BaseEntity;
import com.subsplit.common.enums.AiValidationStatus;
import com.subsplit.common.enums.ProofType;
import com.subsplit.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ownership_proofs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OwnershipProof extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id")
    private Listing listing;

    @Enumerated(EnumType.STRING)
    @Column(name = "proof_type")
    private ProofType proofType;

    @Column(name = "proof_url")
    private String proofUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "ai_status")
    private AiValidationStatus aiStatus;

    @Column(name = "ai_confidence")
    private BigDecimal aiConfidence;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    private LocalDateTime reviewedAt;

    private String remarks;
}
