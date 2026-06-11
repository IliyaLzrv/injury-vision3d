import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge.jsx';
import Card from '../ui/Card.jsx';
import { buttonStyles } from '../ui/buttonStyles.js';
import {
	formatLabel,
	formatLogDate,
	INJURY_TYPE_LABELS,
	RECOVERY_STATUS_LABELS,
} from '../injury/injuryLogUtils.js';
import { getLogTimestamp } from '../report/weeklyReportUtils.js';
import { BODY_PART_LABELS } from './bodyParts.js';
import { buildLatestLogByBodyPart } from './bodyPainColors.js';

function getStatusMeta(log) {
	if (!log) {
		return { label: 'No Data', variant: 'muted' };
	}

	if (log.recoveryStatus === 'RECOVERED') {
		return { label: 'Healthy / Recovered', variant: 'green' };
	}

	if (log.recoveryStatus === 'RECOVERING') {
		return { label: 'Recovering', variant: 'indigo' };
	}

	const painLevel = Number(log.painLevel);
	if (painLevel >= 7) {
		return { label: 'High Pain', variant: 'red' };
	}
	if (painLevel >= 4) {
		return { label: 'Moderate Pain', variant: 'orange' };
	}

	return { label: 'Light Pain', variant: 'green' };
}

function PainTrendMini({ logs }) {
	const trend = useMemo(
		() =>
			[...logs]
				.sort((a, b) => getLogTimestamp(a) - getLogTimestamp(b))
				.slice(-7),
		[logs]
	);

	if (trend.length === 0) {
		return (
			<div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
				<p className="text-xs font-medium text-slate-500">Pain trend</p>
				<p className="mt-2 text-sm text-slate-400">No logs for this area yet</p>
			</div>
		);
	}

	return (
		<div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
			<p className="text-xs font-medium text-slate-500">Pain trend</p>
			<div className="mt-3 flex h-12 items-end gap-1.5">
				{trend.map((log) => (
					<div
						key={log.id}
						className="flex-1 rounded-sm bg-sky-400/90"
						style={{ height: `${Math.max(12, log.painLevel * 10)}%` }}
						title={`${formatLogDate(log)}: ${log.painLevel}/10`}
					/>
				))}
			</div>
			<p className="mt-2 text-[11px] text-slate-400">
				Self-tracked pain levels over recent logs
			</p>
		</div>
	);
}

export default function SelectedBodyPartPanel({
	selectedBodyPart,
	injuryLogs = [],
	onAddInjuryLog,
}) {
	const latestLogByPart = useMemo(
		() => buildLatestLogByBodyPart(injuryLogs),
		[injuryLogs]
	);

	const partLogs = useMemo(() => {
		if (!selectedBodyPart) {
			return [];
		}

		return injuryLogs
			.filter((log) => log.bodyPart === selectedBodyPart)
			.sort((a, b) => getLogTimestamp(b) - getLogTimestamp(a));
	}, [injuryLogs, selectedBodyPart]);

	if (!selectedBodyPart) {
		return (
			<Card className="flex min-h-[420px] flex-col">
				<div className="flex flex-1 flex-col items-center justify-center text-center">
					<div
						className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-sky-50 text-sky-500"
						aria-hidden="true"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							className="h-7 w-7"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
							/>
						</svg>
					</div>
					<p className="mt-5 text-lg font-semibold text-slate-900">
						Select a body part
					</p>
					<p className="mt-2 max-w-[260px] text-sm leading-relaxed text-slate-500">
						Click a body zone on the model to view status and add a pain log.
					</p>
				</div>
			</Card>
		);
	}

	const label = BODY_PART_LABELS[selectedBodyPart] ?? selectedBodyPart;
	const latestLog = latestLogByPart[selectedBodyPart];
	const status = getStatusMeta(latestLog);

	return (
		<Card className="flex flex-col">
			<div className="flex flex-wrap items-start justify-between gap-2">
				<div>
					<p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
						Selected body part
					</p>
					<h2 className="mt-1 text-xl font-semibold text-slate-900">{label}</h2>
				</div>
				<Badge variant={status.variant}>{status.label}</Badge>
			</div>

			<dl className="mt-5 grid grid-cols-2 gap-3">
				<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
					<dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
						Pain level
					</dt>
					<dd className="mt-1 text-lg font-semibold text-slate-900">
						{latestLog ? `${latestLog.painLevel}/10` : '—'}
					</dd>
				</div>
				<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
					<dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
						Recovery status
					</dt>
					<dd className="mt-1 text-sm font-semibold text-slate-900">
						{latestLog
							? formatLabel(latestLog.recoveryStatus, RECOVERY_STATUS_LABELS)
							: '—'}
					</dd>
				</div>
				<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
					<dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
						Last activity
					</dt>
					<dd className="mt-1 text-sm font-medium text-slate-700">
						{latestLog
							? formatLabel(latestLog.injuryType, INJURY_TYPE_LABELS)
							: '—'}
					</dd>
				</div>
				<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
					<dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
						Last updated
					</dt>
					<dd className="mt-1 text-sm font-medium text-slate-700">
						{latestLog ? formatLogDate(latestLog) : '—'}
					</dd>
				</div>
			</dl>

			<div className="mt-4">
				<PainTrendMini logs={partLogs} />
			</div>

			<div className="mt-5 space-y-2">
				<button
					type="button"
					onClick={() => onAddInjuryLog?.(selectedBodyPart)}
					className={`${buttonStyles.teal} w-full`}
				>
					+ Add New Log
				</button>
				<div className="grid grid-cols-2 gap-2">
					<a
						href="#injury-history"
						className={`${buttonStyles.secondary} w-full text-center`}
					>
						View Full History
					</a>
					<Link
						to="/reports/weekly"
						className={`${buttonStyles.secondary} w-full text-center`}
					>
						View Weekly Report
					</Link>
				</div>
			</div>

			{partLogs.length > 0 && (
				<div className="mt-6 border-t border-slate-100 pt-5">
					<h3 className="text-sm font-semibold text-slate-900">Recent logs</h3>
					<ul className="mt-3 space-y-2">
						{partLogs.slice(0, 3).map((log) => (
							<li
								key={log.id}
								className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
							>
								<div>
									<p className="text-xs text-slate-500">{formatLogDate(log)}</p>
									<p className="text-sm font-medium text-slate-800">
										{formatLabel(log.injuryType, INJURY_TYPE_LABELS)}
									</p>
								</div>
								<Badge variant="muted">Pain {log.painLevel}/10</Badge>
							</li>
						))}
					</ul>
				</div>
			)}

			<p className="mt-6 text-xs leading-relaxed text-slate-400">
				Sports self-tracking and recovery awareness only — not medical diagnosis.
			</p>
		</Card>
	);
}
