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

function formatAveragePainLevel(value) {
	if (value == null || Number.isNaN(value)) {
		return '0';
	}

	return Number(value).toFixed(1);
}

export default function RecoveryOverviewCards() {
	const [overview, setOverview] = useState(null);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		let cancelled = false;

		async function loadOverview() {
			setLoading(true);
			setErrorMessage('');

			try {
				const data = await reportApi.getRecoveryOverview();
				if (!cancelled) {
					setOverview(data);
				}
			} catch (error) {
				if (!cancelled) {
					setOverview(null);
					setErrorMessage(
						error.message || 'Failed to load recovery overview.'
					);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		loadOverview();

		return () => {
			cancelled = true;
		};
	}, []);

	if (loading) {
		return (
			<section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
				<h2 className="text-lg font-semibold text-slate-900">
					Recovery overview
				</h2>
				<p className="mt-4 text-sm text-slate-500">Loading your summary…</p>
			</section>
		);
	}

	if (errorMessage) {
		return (
			<section className="mt-8 rounded-2xl border border-red-200 bg-white p-6 shadow-sm shadow-slate-200/60">
				<h2 className="text-lg font-semibold text-slate-900">
					Recovery overview
				</h2>
				<p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{errorMessage}
				</p>
			</section>
		);
	}

	const isEmpty = !overview || overview.totalLogs === 0;

	if (isEmpty) {
		return (
			<section className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm shadow-slate-200/60">
				<h2 className="text-lg font-semibold text-slate-900">
					Recovery overview
				</h2>
				<p className="mt-3 text-sm text-slate-500">
					No injury logs yet. Start tracking on the 3D body map to see your
					recovery summary here.
				</p>
				<Link
					to="/body-map"
					className="mt-4 inline-flex rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
				>
					Open 3D Body Map
				</Link>
			</section>
		);
	}

	return (
		<section className="mt-8">
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
					accent="blue"
				/>
				<DashboardSummaryCard
					label="Recovered logs"
					value={overview.recoveredCount}
					accent="teal"
				/>
				<DashboardSummaryCard
					label="Average pain level"
					value={formatAveragePainLevel(overview.averagePainLevel)}
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
