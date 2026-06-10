import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductDisclaimer from '../components/common/ProductDisclaimer.jsx';
import PainTrendChart from '../components/dashboard/PainTrendChart.jsx';
import RecoveryOverviewCards from '../components/dashboard/RecoveryOverviewCards.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import TrainingLoadForm from '../components/training/TrainingLoadForm.jsx';
import TrainingLoadSummary from '../components/training/TrainingLoadSummary.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardPage() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [trainingRefreshKey, setTrainingRefreshKey] = useState(0);

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
				eyebrow="Sports self-tracking"
				title={`Welcome, ${user?.fullName ?? 'Athlete'}`}
				description={`Signed in as ${user?.email}. Review self-tracked recovery awareness data below.`}
				badge="Recovery dashboard"
			/>

			<ProductDisclaimer className="mb-6" />

			<RecoveryOverviewCards />

			<PainTrendChart />

			<section className="mt-8">
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

			<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
					className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 transition hover:border-teal-300 hover:shadow-md"
				>
					<p className="text-sm font-medium text-slate-900">Open Weekly Report</p>
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
		</>
	);
}
