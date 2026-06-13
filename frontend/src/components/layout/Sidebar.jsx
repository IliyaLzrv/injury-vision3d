import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { cn } from '../ui/buttonStyles.js';

const mainNavItems = [
	{ label: '3D Body Map', to: '/body-map' },
	{ label: 'Dashboard', to: '/dashboard' },
	{ label: 'Injury History', to: '/body-map#injury-history' },
	{ label: 'Weekly Report', to: '/reports/weekly' },
	{ label: 'PDF Export', to: '/reports/weekly', actionOnly: true },
];

const mobileNavItems = [
	{ label: 'Dashboard', to: '/dashboard', match: 'dashboard' },
	{ label: 'Body Map', to: '/body-map', match: 'body-map' },
	{ label: 'History', to: '/body-map#injury-history', match: 'history' },
	{ label: 'Report', to: '/reports/weekly', match: 'weekly-report' },
];

function isMainNavActive(item, location) {
	if (item.actionOnly) {
		return false;
	}

	const { pathname, hash } = location;

	if (item.label === '3D Body Map') {
		return pathname === '/body-map' && hash !== '#injury-history';
	}

	if (item.label === 'Injury History') {
		return pathname === '/body-map' && hash === '#injury-history';
	}

	if (item.label === 'Dashboard') {
		return pathname === '/dashboard';
	}

	if (item.label === 'Weekly Report') {
		return pathname === '/reports/weekly';
	}

	return pathname === item.to;
}

function isMobileNavActive(match, location) {
	const { pathname, hash } = location;

	switch (match) {
		case 'dashboard':
			return pathname === '/dashboard';
		case 'body-map':
			return pathname === '/body-map' && hash !== '#injury-history';
		case 'history':
			return pathname === '/body-map' && hash === '#injury-history';
		case 'weekly-report':
			return pathname === '/reports/weekly';
		default:
			return false;
	}
}

function navLinkClassName(isActive) {
	return cn(
		'flex shrink-0 items-center rounded-lg px-3 py-2 text-sm font-medium transition',
		isActive
			? 'bg-sky-50 text-sky-700'
			: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
	);
}

function NavItem({ item, location }) {
	if (item.actionOnly) {
		return (
			<Link
				to={item.to}
				className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
			>
				{item.label}
			</Link>
		);
	}

	return (
		<NavLink
			to={item.to}
			end={false}
			isActive={() => isMainNavActive(item, location)}
			className={({ isActive }) => navLinkClassName(isActive)}
		>
			{item.label}
		</NavLink>
	);
}

export default function Sidebar() {
	const { logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	function handleLogout() {
		logout();
		navigate('/');
	}

	return (
		<aside className="w-full shrink-0 border-b border-slate-200 bg-white lg:flex lg:h-dvh lg:w-[260px] lg:flex-col lg:border-b-0 lg:border-r">
			<div className="border-b border-slate-200 px-4 py-4 lg:px-5 lg:py-5">
				<div className="flex items-center gap-3">
					<div
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
						style={{ background: 'linear-gradient(to bottom right, #0EA5E9, #14B8A6)' }}
						aria-hidden="true"
					>
						IV
					</div>
					<div className="min-w-0">
						<p className="truncate text-sm font-semibold text-slate-900">
							InjuryVision 3D
						</p>
						<p className="text-[11px] text-slate-500">High-Fidelity Prototype</p>
					</div>
				</div>
			</div>

			<nav
				className="flex gap-1.5 overflow-x-auto border-b border-slate-100 px-3 py-2 lg:hidden"
				aria-label="Quick navigation"
			>
				{mobileNavItems.map((item) => (
					<NavLink
						key={item.label}
						to={item.to}
						isActive={() => isMobileNavActive(item.match, location)}
						className={({ isActive }) =>
							cn(
								'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition',
								isActive
									? 'bg-sky-50 text-sky-700'
									: 'bg-slate-50 text-slate-600 hover:bg-sky-50'
							)
						}
					>
						{item.label}
					</NavLink>
				))}
			</nav>

			<nav
				className="hidden flex-1 overflow-y-auto px-3 py-4 lg:block"
				aria-label="Main navigation"
			>
				<ul className="space-y-0.5">
					{mainNavItems.map((item) => (
						<li key={item.label}>
							<NavItem item={item} location={location} />
						</li>
					))}
				</ul>
			</nav>

			<div className="border-t border-slate-200 px-4 py-3 lg:py-4">
				<button
					type="button"
					onClick={handleLogout}
					className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 lg:mb-3"
				>
					Log out
				</button>
				<p className="text-[11px] leading-relaxed text-slate-400">
					Self-tracking only. Not medical advice.
				</p>
			</div>
		</aside>
	);
}
