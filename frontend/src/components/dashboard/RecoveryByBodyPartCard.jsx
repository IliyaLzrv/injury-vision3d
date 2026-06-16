import { useMemo } from 'react';
import { BODY_PART_LABELS } from '../body/bodyParts.js';
import { formatLabel } from '../injury/injuryLogUtils.js';
import { getLogTimestamp } from '../report/weeklyReportUtils.js';
import Card from '../ui/Card.jsx';

function painBarWidth(level) {
	return `${Math.min(100, Math.max(0, level * 10))}%`;
}

function painBarColor(level) {
	if (level >= 7) return 'bg-red-500';
	if (level >= 4) return 'bg-orange-500';
	return 'bg-green-500';
}

export default function RecoveryByBodyPartCard({ logs = [], loading = false }) {
	const bodyPartEntries = useMemo(() => {
		const latestByPart = new Map();

		for (const log of logs) {
			const key = log.bodyPart;
			const existing = latestByPart.get(key);
			if (!existing || getLogTimestamp(log) > getLogTimestamp(existing)) {
				latestByPart.set(key, log);
			}
		}

		return [...latestByPart.values()]
			.sort((a, b) => getLogTimestamp(b) - getLogTimestamp(a))
			.slice(0, 6);
	}, [logs]);

	return (
		<Card className="h-full">
			<h2 className="text-lg font-semibold text-slate-900">
				Recovery by Body Part
			</h2>
			<p className="mt-1 text-sm text-slate-500">
				Latest self-tracked pain level per area
			</p>

			{loading && (
				<p className="mt-6 text-sm text-slate-500">Loading body part data…</p>
			)}

			{!loading && bodyPartEntries.length === 0 && (
				<p className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
					No body part data yet. Log on the 3D body map to see recovery by area.
				</p>
			)}

			{!loading && bodyPartEntries.length > 0 && (
				<ul className="mt-6 space-y-4">
					{bodyPartEntries.map((log) => (
						<li key={log.id ?? log.bodyPart}>
							<div className="mb-1.5 flex items-center justify-between gap-2">
								<span className="text-sm font-medium text-slate-700">
									{formatLabel(log.bodyPart, BODY_PART_LABELS)}
								</span>
								<span className="text-xs font-semibold text-slate-500">
									{log.painLevel}/10
								</span>
							</div>
							<div className="h-2 overflow-hidden rounded-full bg-slate-100">
								<div
									className={`h-full rounded-full ${painBarColor(log.painLevel)}`}
									style={{ width: painBarWidth(log.painLevel) }}
								/>
							</div>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
}
