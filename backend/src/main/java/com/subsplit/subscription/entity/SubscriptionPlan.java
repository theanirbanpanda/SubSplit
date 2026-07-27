package com.subsplit.subscription.entity;

import com.subsplit.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name="subscription_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionPlan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="subscription_id")
    private Subscription subscription;

    @Column(name="plan_name")
    private String planName;

    @Column(name="max_members")
    @Builder.Default
    private Integer maxMembers = 4;

    @Column(name="monthly_price")
    @Builder.Default
    private BigDecimal monthlyPrice = BigDecimal.ZERO;

    @Column(name="yearly_price")
    @Builder.Default
    private BigDecimal yearlyPrice = BigDecimal.ZERO;

    @Builder.Default
    @Column(name="sharing_allowed")
    private Boolean sharingAllowed = true;

    @Builder.Default
    @Column(name="is_active")
    private Boolean active = true;

    @PrePersist
    public void prePersist() {
        if (monthlyPrice == null) {
            monthlyPrice = BigDecimal.ZERO;
        }
        if (yearlyPrice == null) {
            yearlyPrice = monthlyPrice.multiply(BigDecimal.valueOf(10));
        }
        if (maxMembers == null) {
            maxMembers = 4;
        }
        if (sharingAllowed == null) {
            sharingAllowed = true;
        }
        if (active == null) {
            active = true;
        }
    }

    @PreUpdate
    public void preUpdate() {
        if (monthlyPrice == null) {
            monthlyPrice = BigDecimal.ZERO;
        }
        if (yearlyPrice == null) {
            yearlyPrice = monthlyPrice.multiply(BigDecimal.valueOf(10));
        }
        if (maxMembers == null) {
            maxMembers = 4;
        }
        if (sharingAllowed == null) {
            sharingAllowed = true;
        }
        if (active == null) {
            active = true;
        }
    }
}
