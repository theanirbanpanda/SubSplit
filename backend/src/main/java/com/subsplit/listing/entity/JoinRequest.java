package com.subsplit.listing.entity;

import com.subsplit.common.entity.BaseEntity;
import com.subsplit.common.enums.JoinRequestStatus;
import com.subsplit.common.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "join_requests",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"listing_id", "member_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JoinRequest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id")
    private Listing listing;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private User member;

    @Enumerated(EnumType.STRING)
    private JoinRequestStatus status;

    private String message;

    @Column(name = "credentials_username")
    private String credentialsUsername;

    @Column(name = "credentials_password")
    private String credentialsPassword;

    @Column(name = "credentials_notes", columnDefinition = "LONGTEXT")
    private String credentialsNotes;

    @Column(name = "credentials_shared_at")
    private java.time.LocalDateTime credentialsSharedAt;

    @Column(name = "proof_image", columnDefinition = "LONGTEXT")
    private String proofImage;

    @Column(name = "proof_submitted_at")
    private java.time.LocalDateTime proofSubmittedAt;
}

