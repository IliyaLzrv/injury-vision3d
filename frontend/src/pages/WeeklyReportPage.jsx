import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { injuryApi } from '../api/injuryApi.js';
import { reportApi } from '../api/reportApi.js';
import { trainingLoadApi } from '../api/trainingLoadApi.js';
import ProductDisclaimer from '../components/common/ProductDisclaimer.jsx';
import PainTrendChart from '../components/dashboard/PainTrendChart.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import ExportReportButton from '../components/report/ExportReportButton.jsx';
import RecoveryAwarenessCard from '../components/report/RecoveryAwarenessCard.jsx';
import WeeklyBodyPartSummary from '../components/report/WeeklyBodyPartSummary.jsx';
import WeeklyReportBanner from '../components/report/WeeklyReportBanner.jsx';
import WeeklyReportLogList from '../components/report/WeeklyReportLogList.jsx';
import WeeklyReportPdfHeader from '../components/report/WeeklyReportPdfHeader.jsx';
import WeeklyReportSummary from '../components/report/WeeklyReportSummary.jsx';
import {
	filterLogsByWeek,
	formatWeekRange,
	getCurrentWeekRange,
} from '../components/report/weeklyReportUtils.js';
import { useAuth } from '../context/AuthContext.jsx';

function formatGeneratedDate() {
	return new Date().toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

const PDF_SAFE_WRAPPER_STYLE = {
	backgroundColor: '#ffffff',
	color: '#0f172a',
};

export default function WeeklyReportPage() {
	const reportRef = useRef(null);
	const { user } = useAuth();
	const [overview, setOverview] = useState(null);
	const [injuryLogs, setInjuryLogs] = useState([]);
	const [trainingLoads, setTrainingLoads] = useState([]);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');

	const weekRange = useMemo(() => getCurrentWeekRange(), []);
	const generatedDate = useMemo(() => formatGeneratedDate(), []);
	const periodLabel = formatWeekRange(weekRange.start, weekRange.end);

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

	const canExport = !loading && !errorMessage && !isEmpty;

	return (
		<>
			<div className="mb-6 flex flex-wrap items-start justify-between gap-4">
				<PageHeader
					title="Weekly Recovery Report"
					badge="High-Fidelity Prototype"
					description={periodLabel}
				/>
				<ExportReportButton reportRef={reportRef} disabled={!canExport} />
			</div>

			<div
				ref={reportRef}
				data-pdf-report="true"
				className="space-y-6 rounded-2xl border border-slate-200 p-6 shadow-sm"
				style={PDF_SAFE_WRAPPER_STYLE}
			>
				<WeeklyReportPdfHeader
					athleteName={user?.fullName}
					periodLabel={periodLabel}
					generatedDate={generatedDate}
				/>

				{loading && (
					<p
						className="rounded-2xl border p-6 text-sm"
						style={{ borderColor: '#e2e8f0', color: '#64748b' }}
					>
						Loading weekly report…
					</p>
				)}

				{!loading && errorMessage && (
					<p
						className="rounded-2xl border p-6 text-sm"
						style={{
							borderColor: '#fecaca',
							backgroundColor: '#fef2f2',
							color: '#b91c1c',
						}}
					>
						{errorMessage}
					</p>
				)}

				{isEmpty && (
					<div
						className="rounded-2xl border border-dashed p-8 text-center"
						style={{ borderColor: '#cbd5e1', backgroundColor: '#f8fafc' }}
					>
						<p className="text-base font-medium" style={{ color: '#0f172a' }}>
							No report data yet
						</p>
						<p className="mt-2 text-sm" style={{ color: '#64748b' }}>
							Start logging on the body map or dashboard to build your weekly
							recovery report.
						</p>
						<div className="mt-4 flex flex-wrap justify-center gap-3">
							<Link
								to="/body-map"
								className="inline-flex rounded-lg px-4 py-2 text-sm font-medium text-white"
								style={{ backgroundColor: '#14b8a6' }}
							>
								Open 3D Body Map
							</Link>
							<Link
								to="/dashboard"
								className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium"
								style={{
									borderColor: '#e2e8f0',
									backgroundColor: '#ffffff',
									color: '#334155',
								}}
							>
								Go to Dashboard
							</Link>
						</div>
					</div>
				)}

				{!loading && !errorMessage && !isEmpty && (
					<div className="space-y-6">
						<WeeklyReportBanner />

						<WeeklyReportSummary
							overview={overview}
							trainingLoads={weeklyTrainingLoads}
							weeklyLogCount={weeklyInjuryLogs.length}
							variant="weekly"
						/>

						<div className="grid gap-4 xl:grid-cols-2">
							<PainTrendChart
								logs={weeklyInjuryLogs}
								loading={loading}
								title="Pain Trend"
								description="Self-tracked pain data for recovery awareness this week."
								className=""
								showEmptyLink={false}
								pdfSafe
							/>
							<WeeklyBodyPartSummary logs={weeklyInjuryLogs} />
						</div>

						<RecoveryAwarenessCard
							overview={overview}
							weeklyLogs={weeklyInjuryLogs}
							weeklyTrainingLoads={weeklyTrainingLoads}
						/>

						<WeeklyReportSummary
							overview={overview}
							trainingLoads={weeklyTrainingLoads}
							variant="training"
						/>

						<WeeklyReportLogList logs={weeklyInjuryLogs} />
					</div>
				)}

				<ProductDisclaimer variant="pdf" className="mt-2" />
			</div>
		</>
	);
}
