import { Link, useNavigate } from 'react-router-dom';
import ProductDisclaimer from '../components/common/ProductDisclaimer.jsx';
import RecoveryOverviewCards from '../components/dashboard/RecoveryOverviewCards.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardPage() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	function handleLogout() {
		logout();
		navigate('/login');
	}

	return (
		<div className="min-h-dvh bg-gradient-to-b from-slate-50 via-white to-cyan-50 text-slate-900">
			<div className="mx-auto max-w-5xl px-6 py-12">
				<div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1 text-xs font-medium text-teal-700 shadow-sm">
					<span className="h-2 w-2 rounded-full bg-teal-500" aria-hidden="true" />
					Sports recovery dashboard
				</div>

				<h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
					Welcome, {user?.fullName ?? 'Athlete'}
				</h1>
				<p className="mt-2 text-slate-600">You are signed in as {user?.email}</p>

				<ProductDisclaimer className="mt-6" />

				<RecoveryOverviewCards />

				<div className="mt-8 grid gap-4 sm:grid-cols-2">
					<Link
						to="/body-map"
						className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60 transition hover:border-teal-300 hover:shadow-md"
					>
						<p className="text-sm font-medium text-slate-900">Open 3D Body Map</p>
						<p className="mt-2 text-sm text-slate-500">
							Track pain and recovery on the interactive body model
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
			</div>
		</div>
	);
}
