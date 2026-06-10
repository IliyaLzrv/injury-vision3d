import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { cn } from '../ui/buttonStyles.js';

const mainNavItems = [
	{ label: 'Start', to: '/' },
	{ label: '3D Body Map', to: '/body-map' },
	{ label: 'Dashboard', to: '/dashboard' },
	{ label: 'Injury History', to: null, placeholder: true },
	{ label: 'Weekly Report', to: '/reports/weekly' },
	{ label: 'PDF Export', to: '/reports/weekly' },
	{ label: 'Smart Suggestions', to: null, placeholder: true },
	{ label: 'MVP vs Stretch', to: null, placeholder: true },
	{ label: 'Design System', to: null, placeholder: true },
];

const supportingNavItems = [
	{ label: 'Log In', to: '/login' },
	{ label: 'Register', to: '/register' },
];

function navLinkClassName({ isActive }) {
	return cn(
		'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition',
		isActive
			? 'bg-sky-50 text-sky-700'
			: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
	);
}

function NavItem({ item, isAuthenticated }) {
	if (item.placeholder) {
		return (
			<span
				className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-400"
				title="Coming in a future sprint"
				aria-disabled="true"
			>
				{item.label}
				<span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
					Soon
				</span>
			</span>
		);
	}

	if (
		isAuthenticated &&
		(item.to === '/login' || item.to === '/register')
	) {
		return (
			<span
				className="flex cursor-not-allowed items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-400"
				aria-disabled="true"
				title="You are already signed in"
			>
				{item.label}
			</span>
		);
	}

	return (
		<NavLink
			to={item.to}
			className={navLinkClassName}
			end={item.to === '/dashboard' || item.to === '/'}
		>
			{item.label}
		</NavLink>
	);
}

export default function Sidebar() {
	const { isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();

	function handleLogout() {
		logout();
		navigate('/login');
	}

	return (
		<aside className="flex h-dvh w-[260px] shrink-0 flex-col border-r border-slate-200 bg-white">
			<div className="border-b border-slate-200 px-5 py-5">
				<div className="flex items-center gap-3">
					<div
						className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-sm font-bold text-white shadow-sm"
						aria-hidden="true"
					>
						IV
					</div>
					<div>
						<p className="text-sm font-semibold text-slate-900">InjuryVision 3D</p>
						<p className="text-[11px] text-slate-500">High-Fidelity Prototype</p>
					</div>
				</div>
			</div>

			<nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
				<p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
					Main
				</p>
				<ul className="space-y-0.5">
					{mainNavItems.map((item) => (
						<li key={item.label}>
							<NavItem item={item} isAuthenticated={isAuthenticated} />
						</li>
					))}
				</ul>

				<p className="mt-6 px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
					Supporting
				</p>
				<ul className="space-y-0.5">
					{supportingNavItems.map((item) => (
						<li key={item.label}>
							<NavItem item={item} isAuthenticated={isAuthenticated} />
						</li>
					))}
				</ul>
			</nav>

			<div className="border-t border-slate-200 px-4 py-4">
				{isAuthenticated && (
					<button
						type="button"
						onClick={handleLogout}
						className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
					>
						Log out
					</button>
				)}
				<p className="text-[11px] leading-relaxed text-slate-400">
					Self-tracking only. Not medical advice.
				</p>
			</div>
		</aside>
	);
}
