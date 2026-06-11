import { useEffect, useMemo, useState } from 'react';
import { trainingLoadApi } from '../../api/trainingLoadApi.js';
import {
	formatLogDate,
	formatTrainingType,
	getLoadLabel,
} from './trainingLoadUtils.js';

function SummaryStat({ label, value }) {
	return (
		<div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
			<p className="text-xs font-medium uppercase tracking-wide text-slate-500">
				{label}
			</p>
			<p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
		</div>
	);
}

export default function TrainingLoadSummary({ refreshKey = 0 }) {
	const [loads, setLoads] = useState([]);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		let cancelled = false;

		async function loadTrainingLoads() {
			setLoading(true);
			setErrorMessage('');

			try {
				const data = await trainingLoadApi.getTrainingLoads();
				if (!cancelled) {
					setLoads(Array.isArray(data) ? data : []);
				}
			} catch (error) {
				if (!cancelled) {
					setLoads([]);
					setErrorMessage(
						error.message || 'Failed to load training load summary.'
					);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		loadTrainingLoads();

		return () => {
			cancelled = true;
		};
	}, [refreshKey]);

	const summary = useMemo(() => {
		if (loads.length === 0) {
			return null;
		}

		const latest = loads[0];
		const totalSessions = loads.length;
		const averageLoadScore = Math.round(
			loads.reduce((sum, load) => sum + load.loadScore, 0) / totalSessions
		);

		return {
			latest,
			totalSessions,
			averageLoadScore,
			latestLoadLabel: getLoadLabel(latest.loadScore),
		};
	}, [loads]);

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
			<h3 className="text-base font-semibold text-slate-900">Training load summary</h3>
			<p className="mt-1 text-sm text-slate-500">
				Training load is calculated from your self-tracked duration and intensity.
				It helps you reflect on training context and recovery awareness.
			</p>

			{loading && (
				<p className="mt-5 text-sm text-slate-500">Loading training summary…</p>
			)}

			{!loading && errorMessage && (
				<p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{errorMessage}
				</p>
			)}

			{!loading && !errorMessage && !summary && (
				<p className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
					No training sessions logged yet.
				</p>
			)}

			{!loading && !errorMessage && summary && (
				<div className="mt-5 space-y-4">
					<div className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3">
						<p className="text-xs font-medium uppercase tracking-wide text-teal-700">
							Latest load level
						</p>
						<p className="mt-1 text-2xl font-semibold text-teal-900">
							{summary.latestLoadLabel}
						</p>
					</div>

					<div className="grid gap-3 sm:grid-cols-2">
						<SummaryStat
							label="Latest session"
							value={formatTrainingType(summary.latest.trainingType)}
						/>
						<SummaryStat
							label="Latest load score"
							value={summary.latest.loadScore}
						/>
						<SummaryStat
							label="Average load score"
							value={summary.averageLoadScore}
						/>
						<SummaryStat
							label="Total sessions"
							value={summary.totalSessions}
						/>
					</div>

					<p className="text-xs text-slate-500">
						Latest session date: {formatLogDate(summary.latest.logDate)}
					</p>
				</div>
			)}
		</div>
	);
}
