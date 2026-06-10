import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reportApi } from '../../api/reportApi.js';
import DashboardSummaryCard from './DashboardSummaryCard.jsx';

function formatLatestLogDate(dateString) {
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

function formatRecoveryProgress(overview) {
	if (!overview || overview.totalLogs === 0) {
		return '0%';
	}

	return `${Math.round((overview.recoveredCount / overview.totalLogs) * 100)}%`;
}

export default function RecoveryOverviewCards({
	overview: externalOverview,
	loading: externalLoading,
	errorMessage: externalError,
	variant = 'default',
}) {
	const [internalOverview, setInternalOverview] = useState(null);
	const [internalLoading, setInternalLoading] = useState(
		externalOverview === undefined
	);
	const [internalError, setInternalError] = useState('');

	const overview = externalOverview ?? internalOverview;
	const loading =
		externalLoading ?? (externalOverview === undefined ? internalLoading : false);
	const errorMessage = externalError ?? internalError;

	useEffect(() => {
		if (externalOverview !== undefined) {
			return undefined;
		}

		let cancelled = false;

		async function loadOverview() {
			setInternalLoading(true);
			setInternalError('');

			try {
				const data = await reportApi.getRecoveryOverview();
				if (!cancelled) {
					setInternalOverview(data);
				}
			} catch (error) {
				if (!cancelled) {
					setInternalOverview(null);
					setInternalError(
						error.message || 'Failed to load recovery overview.'
					);
				}
			} finally {
				if (!cancelled) {
					setInternalLoading(false);
				}
			}
		}

		loadOverview();

		return () => {
			cancelled = true;
		};
	}, [externalOverview]);

	if (loading) {
		return (
			<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
				<p className="text-sm text-slate-500">Loading recovery overview…</p>
			</section>
		);
	}

	if (errorMessage) {
		return (
			<section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm shadow-slate-200/60">
				<p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{errorMessage}
				</p>
			</section>
		);
	}

	const isEmpty = !overview || overview.totalLogs === 0;

	if (isEmpty) {
		return (
			<section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm shadow-slate-200/60">
				<p className="text-sm text-slate-500">
					No injury logs yet. Start tracking on the 3D body map to see your
					recovery summary here.
				</p>
				<Link
					to="/body-map"
					className="mt-4 inline-flex rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-400"
				>
					Open 3D Body Map
				</Link>
			</section>
		);
	}

	if (variant === 'dashboard') {
		return (
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<DashboardSummaryCard
					label="Active Pain Logs"
					value={overview.activeCount}
					accent="amber"
					hint="Self-tracked active areas"
				/>
				<DashboardSummaryCard
					label="Recovering Areas"
					value={overview.recoveringCount}
					accent="indigo"
					hint="Recovery awareness in progress"
				/>
				<DashboardSummaryCard
					label="Highest Pain Level"
					value={`${overview.highestPainLevel}/10`}
					accent="amber"
					hint="Peak self-tracked pain"
				/>
				<DashboardSummaryCard
					label="Recovery Progress"
					value={formatRecoveryProgress(overview)}
					accent="teal"
					hint="Recovered logs share"
				/>
			</div>
		);
	}

	return (
		<section>
			<div className="mb-4">
				<h2 className="text-lg font-semibold text-slate-900">
					Recovery overview
				</h2>
				<p className="mt-1 text-sm text-slate-500">
					Your personal sports self-tracking summary
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<DashboardSummaryCard
					label="Active logs"
					value={overview.activeCount}
					accent="amber"
				/>
				<DashboardSummaryCard
					label="Recovering logs"
					value={overview.recoveringCount}
					accent="indigo"
				/>
				<DashboardSummaryCard
					label="Recovered logs"
					value={overview.recoveredCount}
					accent="teal"
				/>
				<DashboardSummaryCard
					label="Average pain level"
					value={Number(overview.averagePainLevel).toFixed(1)}
					accent="blue"
				/>
				<DashboardSummaryCard
					label="Highest pain level"
					value={overview.highestPainLevel}
					accent="amber"
				/>
				<DashboardSummaryCard
					label="Total logs"
					value={overview.totalLogs}
					accent="slate"
				/>
				<DashboardSummaryCard
					label="Latest log date"
					value={formatLatestLogDate(overview.latestLogDate)}
					accent="teal"
				/>
			</div>
		</section>
	);
}
