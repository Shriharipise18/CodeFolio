package org.example.portfolioai.repository;

import org.example.portfolioai.entity.PortfolioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioRepository extends JpaRepository<PortfolioEntity, Long> {
    List<PortfolioEntity> findAllByOrderByCreatedAtDesc();

    List<PortfolioEntity> findAllByUserOrderByCreatedAtDesc(org.example.portfolioai.entity.UserEntity user);
}
