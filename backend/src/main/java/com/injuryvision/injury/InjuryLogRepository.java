package com.injuryvision.injury;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InjuryLogRepository extends JpaRepository<InjuryLog, Long> {

	List<InjuryLog> findByUserIdOrderByCreatedAtDesc(Long userId);

	Optional<InjuryLog> findByIdAndUserId(Long id, Long userId);
}
