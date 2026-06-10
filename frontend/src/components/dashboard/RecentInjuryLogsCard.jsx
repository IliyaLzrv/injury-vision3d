import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BODY_PART_LABELS } from '../body/bodyParts.js';
import {
	formatLabel,
	formatLogDate,
	RECOVERY_STATUS_LABELS,
} from '../injury/injuryLogUtils.js';
import { getLogTimestamp } from '../report/weeklyReportUtils.js';
import Badge from '../ui/Badge.jsx';
import Card from '../ui/Card.jsx';

export default function RecentInjuryLogsCard({ logs = [], loading = false }) {
	const recentLogs = useMemo(
		() =>
			[...logs]
				.sort((a, b) => getLogTimestamp(b) - getLogTimestamp(a))
				.slice(0, 5),
		[logs]
	);

	return (
		<Card>
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h2 className="text-lg font-semibold text-slate-900">
						Recent Injury Logs
					</h2>
					<p className="mt-1 text-sm text-slate-500">
						Your latest self-tracked recovery entries
					</p>
				</div>
				<Link
					to="/body-map"
					className="text-sm font-medium text-sky-600 hover:text-sky-500"
				>
					View all
				</Link>
			</div>

			{loading && (
				<p className="mt-6 text-sm text-slate-500">Loading recent logs…</p>
			)}

			{!loading && recentLogs.length === 0 && (
				<p className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
					No injury logs yet. Start on the 3D body map.
				</p>
			)}

			{!loading && recentLogs.length > 0 && (
				<ul className="mt-6 divide-y divide-slate-100">
					{recentLogs.map((log) => (
						<li
							key={log.id}
							className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
						>
							<div>
								<p className="text-sm font-medium text-slate-900">
									{formatLabel(log.bodyPart, BODY_PART_LABELS)}
								</p>
								<p className="mt-0.5 text-xs text-slate-500">
									{formatLogDate(log)}
								</p>
							</div>
							<div className="flex items-center gap-2">
								<Badge variant="muted">Pain {log.painLevel}/10</Badge>
								<Badge variant="indigo">
									{formatLabel(log.recoveryStatus, RECOVERY_STATUS_LABELS)}
								</Badge>
							</div>
						</li>
					))}
				</ul>
			)}
		</Card>
	);
}
