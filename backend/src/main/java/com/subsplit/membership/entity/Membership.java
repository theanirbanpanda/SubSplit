package com.subsplit.membership.entity;

import java.time.LocalDate;

import com.subsplit.common.entity.BaseEntity;
import com.subsplit.common.enums.MembershipStatus;
import com.subsplit.listing.entity.Listing;
import com.subsplit.common.entity.User;
import com.subsplit.wallet.entity.EscrowTransaction;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "memberships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Membership extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id")
    private Listing listing;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private User member;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "escrow_transaction_id")
    private EscrowTransaction escrowTransaction;

    private Integer seatNumber;

    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    private MembershipStatus status;

    @OneToOne(mappedBy = "membership", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private SubscriptionCredential credential;

}
