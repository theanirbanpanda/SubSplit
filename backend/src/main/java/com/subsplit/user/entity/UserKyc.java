package com.subsplit.user.entity;

import com.subsplit.common.entity.BaseEntity;
import com.subsplit.common.entity.User;
import com.subsplit.common.enums.GovernmentIdType;
import com.subsplit.common.enums.VerificationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name="user_kyc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserKyc extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name="government_id_type")
    private GovernmentIdType governmentIdType;

    @Column(name="government_id_number")
    private String governmentIdNumber;

    @Column(name="document_url")
    private String documentUrl;

    @Enumerated(EnumType.STRING)
    @Column(name="verification_status")
    private VerificationStatus verificationStatus;

    private LocalDateTime verifiedAt;

    private String remarks;

}
