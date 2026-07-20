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
public class SubscriptionPlan extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="subscription_id")
    private Subscription subscription;

    @Column(name="plan_name")
    private String planName;

    @Column(name="max_members")
    private Integer maxMembers;

    @Column(name="monthly_price")
    private BigDecimal monthlyPrice;

    @Column(name="yearly_price")
    private BigDecimal yearlyPrice;

    @Builder.Default
    @Column(name="sharing_allowed")
    private Boolean sharingAllowed=true;

    @Builder.Default
    @Column(name="is_active")
    private Boolean active=true;

}
