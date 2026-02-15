package org.example.portfolioai.repository;

import org.example.portfolioai.entity.AnalysisEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalysisRepository extends JpaRepository<AnalysisEntity, Long> {
    List<AnalysisEntity> findByUserIdOrderByCreatedAtDesc(Long userId);
}
