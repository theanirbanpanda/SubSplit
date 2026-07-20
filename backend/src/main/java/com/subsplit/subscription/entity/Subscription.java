package com.subsplit.subscription.entity;

import com.subsplit.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="category_id")
    private Category category;

    @Column(name="provider_name")
    private String providerName;

    @Column(name="logo_url")
    private String logoUrl;

    @Column(name="official_website")
    private String officialWebsite;

    @Column(name="is_active")
    @Builder.Default
    private Boolean active=true;

    @OneToMany(mappedBy = "subscription")
    @Builder.Default
    private List<SubscriptionPlan> plans=new ArrayList<>();

}
