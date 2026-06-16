package com.injuryvision.injury;

import com.injuryvision.common.BodyPart;
import com.injuryvision.common.InjuryType;
import com.injuryvision.common.RecoveryStatus;
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
@Table(name = "injury_logs")
public class InjuryLog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private BodyPart bodyPart;

	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private InjuryType injuryType;

	@NotNull
	@Min(1)
	@Max(10)
	@Column(nullable = false)
	private Integer painLevel;

	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 30)
	private RecoveryStatus recoveryStatus;

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

	public BodyPart getBodyPart() {
		return bodyPart;
	}

	public void setBodyPart(BodyPart bodyPart) {
		this.bodyPart = bodyPart;
	}

	public InjuryType getInjuryType() {
		return injuryType;
	}

	public void setInjuryType(InjuryType injuryType) {
		this.injuryType = injuryType;
	}

	public Integer getPainLevel() {
		return painLevel;
	}

	public void setPainLevel(Integer painLevel) {
		this.painLevel = painLevel;
	}

	public RecoveryStatus getRecoveryStatus() {
		return recoveryStatus;
	}

	public void setRecoveryStatus(RecoveryStatus recoveryStatus) {
		this.recoveryStatus = recoveryStatus;
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
