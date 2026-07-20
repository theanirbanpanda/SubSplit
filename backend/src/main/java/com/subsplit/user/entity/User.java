package com.subsplit.user.entity;

import com.subsplit.common.entity.BaseEntity;
import com.subsplit.role.entity.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="role_id")
    private Role role;

    @Column(name="full_name",nullable=false)
    private String fullName;

    @Column(nullable=false,unique=true)
    private String email;

    @Column(unique=true)
    private String phone;

    @Column(name="password_hash",nullable=false)
    private String passwordHash;

    @Column(name="profile_image")
    private String profileImage;

    @Column(name="is_active")
    @Builder.Default
    private Boolean active = true;

    @Column(name="email_verified")
    @Builder.Default
    private Boolean emailVerified = false;

}
