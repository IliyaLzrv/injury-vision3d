import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { injuryApi } from '../api/injuryApi.js';
import { reportApi } from '../api/reportApi.js';
import { trainingLoadApi } from '../api/trainingLoadApi.js';
import ProductDisclaimer from '../components/common/ProductDisclaimer.jsx';
import PainTrendChart from '../components/dashboard/PainTrendChart.jsx';
import WeeklyReportLogList from '../components/report/WeeklyReportLogList.jsx';
import WeeklyReportSummary from '../components/report/WeeklyReportSummary.jsx';
import {
	filterLogsByWeek,
	formatWeekRange,
	getCurrentWeekRange,
} from '../components/report/weeklyReportUtils.js';

export default function WeeklyReportPage() {
	const [overview, setOverview] = useState(null);
	const [injuryLogs, setInjuryLogs] = useState([]);
	const [trainingLoads, setTrainingLoads] = useState([]);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	const weekRange = useMemo(() => getCurrentWeekRange(), []);

	useEffect(() => {
		let cancelled = false;

		async function loadReportData() {
			setLoading(true);
			setErrorMessage('');

			try {
				const [overviewData, injuryData, trainingData] = await Promise.all([
					reportApi.getRecoveryOverview(),
					injuryApi.getInjuryLogs(),
					trainingLoadApi.getTrainingLoads(),
				]);

				if (!cancelled) {
					setOverview(overviewData);
					setInjuryLogs(Array.isArray(injuryData) ? injuryData : []);
					setTrainingLoads(Array.isArray(trainingData) ? trainingData : []);
				}
			} catch (error) {
				if (!cancelled) {
					setOverview(null);
					setInjuryLogs([]);
					setTrainingLoads([]);
					setErrorMessage(error.message || 'Failed to load weekly report.');
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		loadReportData();

		return () => {
			cancelled = true;
		};
	}, []);

	const weeklyInjuryLogs = useMemo(
		() => filterLogsByWeek(injuryLogs, weekRange),
		[injuryLogs, weekRange]
	);

	const weeklyTrainingLoads = useMemo(
		() => filterLogsByWeek(trainingLoads, weekRange),
		[trainingLoads, weekRange]
	);

	const isEmpty =
		!loading &&
		!errorMessage &&
		injuryLogs.length === 0 &&
		trainingLoads.length === 0;

	return (
		<div className="min-h-dvh bg-gradient-to-b from-slate-50 via-white to-cyan-50 text-slate-900">
			<div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
				<Link
					to="/dashboard"
					className="inline-flex text-sm text-slate-500 transition hover:text-teal-700"
				>
					← Back to dashboard
				</Link>

				<h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
					Weekly Injury &amp; Recovery Report
				</h1>
				<p className="mt-2 text-sm font-medium text-teal-700">
					{formatWeekRange(weekRange.start, weekRange.end)}
				</p>
				<p className="mt-3 max-w-3xl text-sm text-slate-600">
					This weekly recovery report is based on your self-tracked pain data,
					recovery logs, and training load reflection for sports self-tracking
					and recovery awareness.
				</p>

				{loading && (
					<p className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
						Loading weekly report…
					</p>
				)}

				{!loading && errorMessage && (
					<p className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
						{errorMessage}
					</p>
				)}

				{isEmpty && (
					<div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
						<p className="text-base font-medium text-slate-900">
							No report data yet
						</p>
						<p className="mt-2 text-sm text-slate-500">
							Start logging injuries on the body map or training sessions on the
							dashboard to build your weekly recovery report.
						</p>
						<div className="mt-4 flex flex-wrap justify-center gap-3">
							<Link
								to="/body-map"
								className="inline-flex rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
							>
								Open 3D Body Map
							</Link>
							<Link
								to="/dashboard"
								className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-300"
							>
								Go to Dashboard
							</Link>
						</div>
					</div>
				)}

				{!loading && !errorMessage && !isEmpty && (
					<div className="mt-8 space-y-8">
						<WeeklyReportSummary
							overview={overview}
							trainingLoads={weeklyTrainingLoads}
						/>

						<PainTrendChart
							logs={weeklyInjuryLogs}
							title="Weekly pain trend"
							description="Self-tracked pain data for recovery awareness this week."
							className=""
							showEmptyLink={false}
						/>

						<WeeklyReportLogList logs={weeklyInjuryLogs} />
					</div>
				)}

				<ProductDisclaimer className="mt-8" />
			</div>
		</div>
	);
}
