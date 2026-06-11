import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import BodyMapPage from '../pages/BodyMapPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import StartPage from '../pages/StartPage.jsx';
import WeeklyReportPage from '../pages/WeeklyReportPage.jsx';

function RootRedirect() {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return (
			<div className="flex min-h-dvh items-center justify-center bg-slate-50 text-slate-500">
				<p className="text-sm">Loading...</p>
			</div>
		);
	}

	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	return <StartPage />;
}

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />

			<Route element={<ProtectedRoute />}>
				<Route path="/dashboard" element={<DashboardPage />} />
				<Route path="/body-map" element={<BodyMapPage />} />
				<Route path="/reports/weekly" element={<WeeklyReportPage />} />
			</Route>

			<Route path="/" element={<RootRedirect />} />
			<Route
				path="*"
				element={
					<div
						className="flex min-h-dvh flex-col items-center justify-center gap-2 px-6 text-slate-500"
						style={{ backgroundColor: '#F8FAFC' }}
					>
						<p className="text-lg font-medium text-slate-900">Page not found</p>
						<p className="text-sm">This prototype screen is not available yet.</p>
					</div>
				}
			/>
		</Routes>
	);
}
