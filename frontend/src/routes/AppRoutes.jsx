import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition.jsx';
import ProtectedRoute from '../components/layout/ProtectedRoute.jsx';
import BodyMapPage from '../pages/BodyMapPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import StartPage from '../pages/StartPage.jsx';
import WeeklyReportPage from '../pages/WeeklyReportPage.jsx';

export default function AppRoutes() {
	const location = useLocation();

	return (
		<AnimatePresence mode="wait" initial={false}>
			<Routes location={location} key={location.pathname}>
				<Route
					path="/login"
					element={
						<PageTransition>
							<LoginPage />
						</PageTransition>
					}
				/>
				<Route
					path="/register"
					element={
						<PageTransition>
							<RegisterPage />
						</PageTransition>
					}
				/>

				<Route element={<ProtectedRoute />}>
					<Route
						path="/dashboard"
						element={
							<PageTransition>
								<DashboardPage />
							</PageTransition>
						}
					/>
					<Route
						path="/body-map"
						element={
							<PageTransition>
								<BodyMapPage />
							</PageTransition>
						}
					/>
					<Route
						path="/reports/weekly"
						element={
							<PageTransition>
								<WeeklyReportPage />
							</PageTransition>
						}
					/>
				</Route>

				<Route
					path="/"
					element={
						<PageTransition>
							<StartPage />
						</PageTransition>
					}
				/>
				<Route
					path="*"
					element={
						<PageTransition>
							<div
								className="flex min-h-dvh flex-col items-center justify-center gap-2 px-6 text-slate-500"
								style={{ backgroundColor: '#F8FAFC' }}
							>
								<p className="text-lg font-medium text-slate-900">
									Page not found
								</p>
								<p className="text-sm">
									This prototype screen is not available yet.
								</p>
							</div>
						</PageTransition>
					}
				/>
			</Routes>
		</AnimatePresence>
	);
}
