import { Link } from 'react-router-dom';
import {
	filterLogsByWeek,
	formatWeekRange,
	getCurrentWeekRange,
} from '../report/weeklyReportUtils.js';
import { buttonStyles } from '../ui/buttonStyles.js';
import Card from '../ui/Card.jsx';

export default function WeeklySummaryCard({
	overview,
	injuryLogs = [],
	trainingLoads = [],
	loading = false,
}) {
	const weekRange = getCurrentWeekRange();
	const weeklyLogs = filterLogsByWeek(injuryLogs, weekRange);
	const weeklyTraining = filterLogsByWeek(trainingLoads, weekRange);

	const recoveryProgress =
		overview && overview.totalLogs > 0
			? Math.round((overview.recoveredCount / overview.totalLogs) * 100)
			: 0;

	return (
		<Card>
			<h2 className="text-lg font-semibold text-slate-900">Weekly Summary</h2>
			<p className="mt-1 text-sm text-slate-500">
				{formatWeekRange(weekRange.start, weekRange.end)}
			</p>

			{loading && (
				<p className="mt-6 text-sm text-slate-500">Loading weekly summary…</p>
			)}

			{!loading && (
				<div className="mt-6 grid gap-4 sm:grid-cols-3">
					<div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
						<p className="text-xs font-medium text-slate-500">Injury logs</p>
						<p className="mt-1 text-2xl font-semibold text-slate-900">
							{weeklyLogs.length}
						</p>
					</div>
					<div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
						<p className="text-xs font-medium text-slate-500">Training sessions</p>
						<p className="mt-1 text-2xl font-semibold text-slate-900">
							{weeklyTraining.length}
						</p>
					</div>
					<div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
						<p className="text-xs font-medium text-slate-500">
							Recovery progress
						</p>
						<p className="mt-1 text-2xl font-semibold text-slate-900">
							{recoveryProgress}%
						</p>
					</div>
				</div>
			)}

			<p className="mt-4 text-sm text-slate-500">
				Open your weekly recovery report for a full self-tracked summary.
			</p>

			<Link
				to="/reports/weekly"
				className={`${buttonStyles.primary} mt-4`}
			>
				View Full Report
			</Link>
		</Card>
	);
}
