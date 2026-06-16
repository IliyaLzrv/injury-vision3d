import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AppShell from './AppShell.jsx';

export default function ProtectedRoute() {
	const { isAuthenticated, loading } = useAuth();
	// Captured once on mount. If the user was authenticated when this route
	// first rendered and then logs out, an explicit navigate() call already
	// redirects away (e.g. to the start page). Avoid forcing a redirect to
	// /login while this route is still finishing its exit animation, which
	// would override that navigation.
	const [wasAuthenticated] = useState(isAuthenticated);

	if (loading) {
		return (
			<div className="flex min-h-dvh items-center justify-center bg-slate-50 text-slate-500">
				<p className="text-sm">Loading session...</p>
			</div>
		);
	}

	if (!isAuthenticated) {
		if (wasAuthenticated) {
			return null;
		}

		return <Navigate to="/login" replace />;
	}

	return (
		<AppShell>
			<Outlet />
		</AppShell>
	);
}
