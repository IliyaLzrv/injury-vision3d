import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { injuryApi } from '../api/injuryApi.js';
import { reportApi } from '../api/reportApi.js';
import { trainingLoadApi } from '../api/trainingLoadApi.js';
import ProductDisclaimer from '../components/common/ProductDisclaimer.jsx';
import DashboardInsightBanner from '../components/dashboard/DashboardInsightBanner.jsx';
import PainTrendChart from '../components/dashboard/PainTrendChart.jsx';
import RecentInjuryLogsCard from '../components/dashboard/RecentInjuryLogsCard.jsx';
import RecoveryByBodyPartCard from '../components/dashboard/RecoveryByBodyPartCard.jsx';
import RecoveryOverviewCards from '../components/dashboard/RecoveryOverviewCards.jsx';
import WeeklySummaryCard from '../components/dashboard/WeeklySummaryCard.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import TrainingLoadForm from '../components/training/TrainingLoadForm.jsx';
import TrainingLoadSummary from '../components/training/TrainingLoadSummary.jsx';
import { buttonStyles } from '../components/ui/buttonStyles.js';
import { filterLogsByWeek, getCurrentWeekRange } from '../components/report/weeklyReportUtils.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardPage() {
	const { logout } = useAuth();
	const navigate = useNavigate();
	const [trainingRefreshKey, setTrainingRefreshKey] = useState(0);
	const [overview, setOverview] = useState(null);
	const [injuryLogs, setInjuryLogs] = useState([]);
	const [trainingLoads, setTrainingLoads] = useState([]);
	const [dataLoading, setDataLoading] = useState(true);
	const [dataError, setDataError] = useState('');

	useEffect(() => {
		let cancelled = false;

		async function loadDashboardData() {
			setDataLoading(true);
			setDataError('');

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
					setDataError(error.message || 'Failed to load dashboard data.');
				}
			} finally {
				if (!cancelled) {
					setDataLoading(false);
				}
			}
		}

		loadDashboardData();
		return () => {
			cancelled = true;
		};
	}, [trainingRefreshKey]);

	const weekRange = getCurrentWeekRange();
	const weeklyInjuryLogs = filterLogsByWeek(injuryLogs, weekRange);

	function handleLogout() {
		logout();
		navigate('/login');
	}

	function handleTrainingSaved() {
		setTrainingRefreshKey((key) => key + 1);
	}

	return (
		<>
			<PageHeader
				title="Dashboard"
				badge="High-Fidelity Prototype"
				description="Your recovery overview for this week."
				actions={
					<Link to="/body-map" className={buttonStyles.teal}>
						Open 3D Body Map
					</Link>
				}
			/>

			<div className="space-y-8">
				<DashboardInsightBanner />

				<RecoveryOverviewCards
					overview={overview}
					loading={dataLoading}
					errorMessage={dataError}
					variant="dashboard"
				/>

				<div className="grid gap-4 xl:grid-cols-2">
					<PainTrendChart
						logs={weeklyInjuryLogs}
						loading={dataLoading}
						title="Pain Trend This Week"
						description="Self-tracked pain data for recovery awareness this week."
						className=""
						showEmptyLink
					/>
					<RecoveryByBodyPartCard logs={injuryLogs} loading={dataLoading} />
				</div>

				<RecentInjuryLogsCard logs={injuryLogs} loading={dataLoading} />

				<WeeklySummaryCard
					overview={overview}
					injuryLogs={injuryLogs}
					trainingLoads={trainingLoads}
					loading={dataLoading}
				/>

				<section>
					<h2 className="text-lg font-semibold text-slate-900">
						Training load analysis
					</h2>
					<p className="mt-1 text-sm text-slate-500">
						Self-tracked training context to support recovery awareness.
					</p>

					<div className="mt-4 grid gap-4 lg:grid-cols-2">
						<TrainingLoadForm onSuccess={handleTrainingSaved} />
						<TrainingLoadSummary refreshKey={trainingRefreshKey} />
					</div>
				</section>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<Link
						to="/body-map"
						className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 transition hover:border-teal-300 hover:shadow-md"
					>
						<p className="text-sm font-medium text-slate-900">Open 3D Body Map</p>
						<p className="mt-2 text-sm text-slate-500">
							Track pain and recovery on the interactive body model
						</p>
					</Link>

					<Link
						to="/reports/weekly"
						className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 transition hover:border-sky-300 hover:shadow-md"
					>
						<p className="text-sm font-medium text-slate-900">
							Open Weekly Report
						</p>
						<p className="mt-2 text-sm text-slate-500">
							Review your weekly pain, recovery, and training load summary
						</p>
					</Link>

					<button
						type="button"
						onClick={handleLogout}
						className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm shadow-slate-200/60 transition hover:border-red-200 hover:shadow-md"
					>
						<p className="text-sm font-medium text-slate-900">Logout</p>
						<p className="mt-2 text-sm text-slate-500">
							End your session and return to login
						</p>
					</button>
				</div>

				<ProductDisclaimer />
			</div>
		</>
	);
}
