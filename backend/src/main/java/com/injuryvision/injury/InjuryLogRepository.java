package com.injuryvision.injury;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InjuryLogRepository extends JpaRepository<InjuryLog, Long> {

	List<InjuryLog> findByUserIdOrderByLogDateDesc(Long userId);
}
