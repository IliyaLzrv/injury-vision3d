package com.injuryvision.training;

import com.injuryvision.common.TrainingType;
import com.injuryvision.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "training_loads")
public class TrainingLoad {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private TrainingType trainingType;

	@NotNull
	@Min(1)
	@Column(nullable = false)
	private Integer durationMinutes;

	@NotNull
	@Min(1)
	@Max(10)
	@Column(nullable = false)
	private Integer intensity;

	@NotNull
	@Column(nullable = false)
	private Integer loadScore;

	@Size(max = 2000)
	@Column(length = 2000)
	private String notes;

	@NotNull
	@Column(nullable = false)
	private LocalDate logDate;

	@Column(nullable = false, updatable = false)
	private Instant createdAt;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@PrePersist
	void onCreate() {
		if (createdAt == null) {
			createdAt = Instant.now();
		}
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public TrainingType getTrainingType() {
		return trainingType;
	}

	public void setTrainingType(TrainingType trainingType) {
		this.trainingType = trainingType;
	}

	public Integer getDurationMinutes() {
		return durationMinutes;
	}

	public void setDurationMinutes(Integer durationMinutes) {
		this.durationMinutes = durationMinutes;
	}

	public Integer getIntensity() {
		return intensity;
	}

	public void setIntensity(Integer intensity) {
		this.intensity = intensity;
	}

	public Integer getLoadScore() {
		return loadScore;
	}

	public void setLoadScore(Integer loadScore) {
		this.loadScore = loadScore;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public LocalDate getLogDate() {
		return logDate;
	}

	public void setLogDate(LocalDate logDate) {
		this.logDate = logDate;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
}
