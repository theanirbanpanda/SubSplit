package com.subsplit.listing.entity;

import com.subsplit.common.entity.BaseEntity;
import com.subsplit.common.enums.JoinRequestStatus;
import com.subsplit.user.entity.User;
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
}
