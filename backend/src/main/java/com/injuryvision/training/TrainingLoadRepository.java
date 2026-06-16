package com.injuryvision.training;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainingLoadRepository extends JpaRepository<TrainingLoad, Long> {

	List<TrainingLoad> findByUserIdOrderByCreatedAtDesc(Long userId);
}
