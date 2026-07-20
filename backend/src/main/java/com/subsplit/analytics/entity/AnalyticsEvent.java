package com.subsplit.analytics.entity;

import com.subsplit.common.entity.BaseEntity;
import com.subsplit.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "analytics_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsEvent extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String eventType;

    private String entityType;

    private Long entityId;

    @Lob
    @Column(columnDefinition = "JSON")
    private String metadata;

}
