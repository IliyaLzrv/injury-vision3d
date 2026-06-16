import DashboardSummaryCard from '../dashboard/DashboardSummaryCard.jsx';
import { getLoadLabel } from '../training/trainingLoadUtils.js';

function formatAveragePain(value) {
	if (value == null || Number.isNaN(value)) {
		return '0';
	}
	return Number(value).toFixed(1);
}

function formatRecoveryProgress(overview) {
	if (!overview || overview.totalLogs === 0) {
		return '0%';
	}
	return `${Math.round((overview.recoveredCount / overview.totalLogs) * 100)}%`;
}

export default function WeeklyReportSummary({
	overview,
	trainingLoads = [],
	weeklyLogCount = 0,
	variant = 'default',
}) {
	const latestTraining = trainingLoads[0] ?? null;
	const totalSessions = trainingLoads.length;
	const averageLoadScore =
		totalSessions > 0
			? Math.round(
					trainingLoads.reduce((sum, load) => sum + load.loadScore, 0) /
						totalSessions
				)
			: 0;

	if (variant === 'training') {
		return (
			<section
				className="rounded-xl border p-5 shadow-sm"
				style={{ borderColor: '#e2e8f0', backgroundColor: '#ffffff' }}
			>
				<h2 className="text-lg font-semibold text-slate-900">
					Training load reflection
				</h2>
				<p className="mt-1 text-sm text-slate-500">
					Self-tracked training context for recovery awareness this week.
				</p>

				{totalSessions === 0 ? (
					<p className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
						No training sessions logged this week.
					</p>
				) : (
					<div className="mt-4 space-y-4">
						<div
							className="rounded-xl border px-4 py-3"
							style={{ borderColor: '#99f6e4', backgroundColor: '#f0fdfa' }}
						>
							<p className="text-xs font-medium uppercase tracking-wide text-teal-700">
								Latest load level
							</p>
							<p className="mt-1 text-2xl font-semibold text-teal-900">
								{getLoadLabel(latestTraining?.loadScore)}
							</p>
						</div>

						<div className="grid gap-4 sm:grid-cols-3">
							<DashboardSummaryCard
								label="Total sessions"
								value={totalSessions}
								accent="slate"
							/>
							<DashboardSummaryCard
								label="Average load score"
								value={averageLoadScore}
								accent="blue"
							/>
							<DashboardSummaryCard
								label="Latest load score"
								value={latestTraining?.loadScore ?? 0}
								accent="teal"
							/>
						</div>
					</div>
				)}
			</section>
		);
	}

	if (variant === 'weekly') {
		return (
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<DashboardSummaryCard
					label="Average Pain"
					value={`${formatAveragePain(overview?.averagePainLevel)}/10`}
					accent="blue"
					hint="Self-tracked weekly average"
				/>
				<DashboardSummaryCard
					label="New Logs"
					value={weeklyLogCount}
					accent="teal"
					hint="Entries this week"
				/>
				<DashboardSummaryCard
					label="Recovery Progress"
					value={formatRecoveryProgress(overview)}
					accent="teal"
					hint="Recovered log share"
				/>
				<DashboardSummaryCard
					label="Recovery Awareness"
					value={overview?.recoveringCount ?? 0}
					accent="indigo"
					hint="Areas marked recovering"
				/>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<section>
				<h2 className="text-lg font-semibold text-slate-900">Recovery summary</h2>
				<p className="mt-1 text-sm text-slate-500">
					Sports self-tracking summary from your injury and recovery logs.
				</p>

				<div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<DashboardSummaryCard
						label="Total injury logs"
						value={overview?.totalLogs ?? 0}
						accent="slate"
					/>
					<DashboardSummaryCard
						label="Average pain level"
						value={formatAveragePain(overview?.averagePainLevel)}
						accent="blue"
					/>
					<DashboardSummaryCard
						label="Highest pain level"
						value={overview?.highestPainLevel ?? 0}
						accent="amber"
					/>
					<DashboardSummaryCard
						label="Active logs"
						value={overview?.activeCount ?? 0}
						accent="amber"
					/>
					<DashboardSummaryCard
						label="Recovering logs"
						value={overview?.recoveringCount ?? 0}
						accent="indigo"
					/>
					<DashboardSummaryCard
						label="Recovered logs"
						value={overview?.recoveredCount ?? 0}
						accent="teal"
					/>
				</div>
			</section>

			<section
				className="rounded-xl border p-5 shadow-sm"
				style={{ borderColor: '#e2e8f0', backgroundColor: '#ffffff' }}
			>
				<h2 className="text-lg font-semibold text-slate-900">
					Training load reflection
				</h2>
				<p className="mt-1 text-sm text-slate-500">
					Training load is calculated from your self-tracked duration and
					intensity for recovery awareness.
				</p>

				{totalSessions === 0 ? (
					<p className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
						No training sessions logged this week.
					</p>
				) : (
					<div className="mt-4 space-y-4">
						<div
							className="rounded-xl border px-4 py-3"
							style={{ borderColor: '#99f6e4', backgroundColor: '#f0fdfa' }}
						>
							<p className="text-xs font-medium uppercase tracking-wide text-teal-700">
								Latest load level
							</p>
							<p className="mt-1 text-2xl font-semibold text-teal-900">
								{getLoadLabel(latestTraining?.loadScore)}
							</p>
						</div>

						<div className="grid gap-4 sm:grid-cols-3">
							<DashboardSummaryCard
								label="Total sessions"
								value={totalSessions}
								accent="slate"
							/>
							<DashboardSummaryCard
								label="Average load score"
								value={averageLoadScore}
								accent="blue"
							/>
							<DashboardSummaryCard
								label="Latest load score"
								value={latestTraining?.loadScore ?? 0}
								accent="teal"
							/>
						</div>
					</div>
				)}
			</section>
		</div>
	);
}
