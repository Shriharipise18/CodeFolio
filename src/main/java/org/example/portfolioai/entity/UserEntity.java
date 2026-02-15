package org.example.portfolioai.entity;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String fullName;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String bio;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String skills;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String experience;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String projects;
}
