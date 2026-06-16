export const INJURY_TYPE_LABELS = {
	PAIN: 'Pain',
	SPRAIN: 'Sprain',
	STRAIN: 'Strain',
	BRUISE: 'Bruise',
	OTHER: 'Other',
};

export const RECOVERY_STATUS_LABELS = {
	ACTIVE: 'Active',
	RECOVERING: 'Recovering',
	RECOVERED: 'Recovered',
};

export function formatLabel(value, labels) {
	return (
		labels[value] ??
		value?.replaceAll('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) ??
		'—'
	);
}

export function formatLogDate(log) {
	if (log.logDate) {
		const [year, month, day] = log.logDate.split('-').map(Number);
		return new Date(year, month - 1, day).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}

	if (log.createdAt) {
		return new Date(log.createdAt).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}

	return '—';
}
