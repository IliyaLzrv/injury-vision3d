import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardPage() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	function handleLogout() {
		logout();
		navigate('/login');
	}

	return (
		<div className="min-h-dvh bg-slate-950 text-slate-100">
			<div className="mx-auto max-w-4xl px-6 py-12">
				<div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1 text-xs text-slate-300">
					<span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
					Sprint 1 — Authenticated
				</div>

				<h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
					Welcome, {user?.fullName ?? 'Athlete'}
				</h1>
				<p className="mt-2 text-slate-400">
					You are signed in as {user?.email}
				</p>

				<p className="mt-6 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
					InjuryVision 3D is a sports self-tracking and recovery awareness tool.
					It does not provide medical diagnosis.
				</p>

				<div className="mt-8 grid gap-4 sm:grid-cols-2">
					<Link
						to="/body-map"
						className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition hover:border-emerald-700/50 hover:bg-slate-900/70"
					>
						<p className="text-sm font-medium text-slate-200">Open 3D Body Map</p>
						<p className="mt-2 text-sm text-slate-400">
							Placeholder for IJ3D-14
						</p>
					</Link>

					<button
						type="button"
						onClick={handleLogout}
						className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 text-left transition hover:border-red-800/50 hover:bg-slate-900/70"
					>
						<p className="text-sm font-medium text-slate-200">Logout</p>
						<p className="mt-2 text-sm text-slate-400">
							End your session and return to login
						</p>
					</button>
				</div>
			</div>
		</div>
	);
}
