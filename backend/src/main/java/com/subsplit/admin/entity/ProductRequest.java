package com.subsplit.admin.entity;

import com.subsplit.common.entity.BaseEntity;
import com.subsplit.common.entity.User;
import com.subsplit.common.enums.ProductRequestStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "category")
    private String category;

    @Column(name = "website_url")
    private String websiteUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ProductRequestStatus status = ProductRequestStatus.PENDING;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;
}
