package com.subsplit.subscription.entity;

import com.subsplit.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "provider_name")
    private String providerName;

    @Column(name = "plan_name")
    @Builder.Default
    private String planName = "Standard Plan";

    @Column(name = "description")
    private String description;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "official_website")
    private String officialWebsite;

    @Column(name = "max_members")
    @Builder.Default
    private Integer maxMembers = 4;

    @Column(name = "monthly_price")
    @Builder.Default
    private BigDecimal monthlyPrice = BigDecimal.ZERO;

    @Column(name = "yearly_price")
    @Builder.Default
    private BigDecimal yearlyPrice = BigDecimal.ZERO;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean active = true;

    @OneToMany(mappedBy = "subscription")
    @Builder.Default
    private List<SubscriptionPlan> plans = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (planName == null || planName.isBlank()) {
            planName = providerName != null ? providerName : "Standard Plan";
        }
        if (maxMembers == null) {
            maxMembers = 4;
        }
        if (monthlyPrice == null) {
            monthlyPrice = BigDecimal.ZERO;
        }
        if (yearlyPrice == null) {
            yearlyPrice = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    public void preUpdate() {
        if (planName == null || planName.isBlank()) {
            planName = providerName != null ? providerName : "Standard Plan";
        }
        if (maxMembers == null) {
            maxMembers = 4;
        }
        if (monthlyPrice == null) {
            monthlyPrice = BigDecimal.ZERO;
        }
        if (yearlyPrice == null) {
            yearlyPrice = BigDecimal.ZERO;
        }
    }
}
