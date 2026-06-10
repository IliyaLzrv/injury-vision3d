import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AppShell from './AppShell.jsx';

export default function ProtectedRoute() {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex min-h-dvh items-center justify-center bg-slate-50 text-slate-500">
				<p className="text-sm">Loading session...</p>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return (
		<AppShell>
			<Outlet />
		</AppShell>
	);
}
