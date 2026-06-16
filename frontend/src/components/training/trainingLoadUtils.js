export const TRAINING_TYPE_LABELS = {
	BASKETBALL: 'Basketball',
	GYM: 'Gym',
	RUNNING: 'Running',
	FOOTBALL: 'Football',
	RECOVERY: 'Recovery',
	OTHER: 'Other',
};

export function formatTrainingType(value) {
	return TRAINING_TYPE_LABELS[value] ?? value ?? '—';
}

export function getLoadLabel(loadScore) {
	if (loadScore == null || loadScore < 300) {
		return 'Low';
	}
	if (loadScore <= 600) {
		return 'Moderate';
	}
	return 'High';
}

export function formatLogDate(dateString) {
	if (!dateString) {
		return '—';
	}

	const [year, month, day] = dateString.split('-').map(Number);
	return new Date(year, month - 1, day).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}
