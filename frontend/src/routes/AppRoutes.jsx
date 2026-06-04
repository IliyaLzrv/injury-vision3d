import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import BodyMapPage from '../pages/BodyMapPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';

function RootRedirect() {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex min-h-dvh items-center justify-center bg-slate-950 text-slate-300">
				<p className="text-sm">Loading...</p>
			</div>
		);
	}

	return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />

			<Route element={<ProtectedRoute />}>
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/body-map" element={<BodyMapPage />} />
			</Route>

			<Route path="/" element={<RootRedirect />} />
			<Route
				path="*"
				element={
					<div className="flex min-h-dvh items-center justify-center bg-slate-950 text-slate-400">
						<p>Page not found.</p>
					</div>
				}
			/>
		</Routes>
	);
}
