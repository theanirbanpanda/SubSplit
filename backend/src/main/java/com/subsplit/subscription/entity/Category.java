package com.subsplit.subscription.entity;

import com.subsplit.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name="categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="category_name")
    private String categoryName;

    private String description;

    private String icon;

    @Column(name="monthly_price")
    @Builder.Default
    private BigDecimal monthlyPrice = BigDecimal.ZERO;

    @Column(name="is_active")
    @Builder.Default
    private Boolean active = true;

    @PrePersist
    public void prePersist() {
        if (monthlyPrice == null) {
            monthlyPrice = BigDecimal.ZERO;
        }
    }

    @PreUpdate
    public void preUpdate() {
        if (monthlyPrice == null) {
            monthlyPrice = BigDecimal.ZERO;
        }
    }
}
