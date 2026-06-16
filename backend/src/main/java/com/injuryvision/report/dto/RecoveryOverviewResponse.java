package com.injuryvision.report.dto;

import com.injuryvision.common.BodyPart;

import java.time.LocalDate;

public class RecoveryOverviewResponse {

	private long activeCount;
	private long recoveringCount;
	private long recoveredCount;
	private long totalLogs;
	private double averagePainLevel;
	private int highestPainLevel;
	private BodyPart mostAffectedBodyPart;
	private LocalDate latestLogDate;

	public long getActiveCount() {
		return activeCount;
	}

	public void setActiveCount(long activeCount) {
		this.activeCount = activeCount;
	}

	public long getRecoveringCount() {
		return recoveringCount;
	}

	public void setRecoveringCount(long recoveringCount) {
		this.recoveringCount = recoveringCount;
	}

	public long getRecoveredCount() {
		return recoveredCount;
	}

	public void setRecoveredCount(long recoveredCount) {
		this.recoveredCount = recoveredCount;
	}

	public long getTotalLogs() {
		return totalLogs;
	}

	public void setTotalLogs(long totalLogs) {
		this.totalLogs = totalLogs;
	}

	public double getAveragePainLevel() {
		return averagePainLevel;
	}

	public void setAveragePainLevel(double averagePainLevel) {
		this.averagePainLevel = averagePainLevel;
	}

	public int getHighestPainLevel() {
		return highestPainLevel;
	}

	public void setHighestPainLevel(int highestPainLevel) {
		this.highestPainLevel = highestPainLevel;
	}

	public BodyPart getMostAffectedBodyPart() {
		return mostAffectedBodyPart;
	}

	public void setMostAffectedBodyPart(BodyPart mostAffectedBodyPart) {
		this.mostAffectedBodyPart = mostAffectedBodyPart;
	}

	public LocalDate getLatestLogDate() {
		return latestLogDate;
	}

	public void setLatestLogDate(LocalDate latestLogDate) {
		this.latestLogDate = latestLogDate;
	}
}
