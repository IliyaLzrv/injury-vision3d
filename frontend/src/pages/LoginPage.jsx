import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthPageLayout, {
	authInputClassName,
} from '../components/layout/AuthPageLayout.jsx';
import { buttonStyles } from '../components/ui/buttonStyles.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
	const { login, isAuthenticated, loading } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [infoMessage, setInfoMessage] = useState(
		location.state?.message ?? ''
	);

	useEffect(() => {
		if (location.state?.message) {
			setInfoMessage(location.state.message);
		}
	}, [location.state]);

	if (!loading && isAuthenticated) {
		return <Navigate to="/body-map" replace />;
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setSubmitting(true);
		setErrorMessage('');

		try {
			await login({ email, password });
			navigate('/body-map');
		} catch (error) {
			setErrorMessage(error.message || 'Login failed. Please try again.');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<AuthPageLayout
			title="Sign in"
			subtitle="Welcome back to InjuryVision 3D sports self-tracking"
			footer={
				<p className="mt-6 text-center text-sm text-slate-500">
					No account yet?{' '}
					<Link to="/register" className="font-medium text-sky-600 hover:text-sky-500">
						Create one
					</Link>
				</p>
			}
		>
			{infoMessage && (
				<p className="mt-4 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800">
					{infoMessage}
				</p>
			)}

			<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
				<div>
					<label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
						Email
					</label>
					<input
						id="email"
						type="email"
						required
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						className={authInputClassName}
						placeholder="you@example.com"
					/>
				</div>

				<div>
					<label
						htmlFor="password"
						className="mb-1 block text-sm font-medium text-slate-700"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						required
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						className={authInputClassName}
						placeholder="••••••••"
					/>
				</div>

				{errorMessage && (
					<p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
						{errorMessage}
					</p>
				)}

				<button
					type="submit"
					disabled={submitting}
					className={`${buttonStyles.primary} w-full`}
				>
					{submitting ? 'Signing in…' : 'Sign in'}
				</button>
			</form>
		</AuthPageLayout>
	);
}
