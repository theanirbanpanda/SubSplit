package com.subsplit.role.entity;

import com.subsplit.common.entity.BaseEntity;
import com.subsplit.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="role_name",nullable = false,unique = true)
    private String roleName;

    private String description;

    @OneToMany(mappedBy = "role",fetch = FetchType.LAZY)
    @Builder.Default
    private List<User> users = new ArrayList<>();

}
