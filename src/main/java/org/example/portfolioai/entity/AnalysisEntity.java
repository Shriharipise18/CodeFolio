package org.example.portfolioai.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_analysis")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private String targetRole;

    private Integer matchScore;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String rawJsonContent; // Stores the full JSON response from AI for reconstruction

    @CreationTimestamp
    private LocalDateTime createdAt;
}
