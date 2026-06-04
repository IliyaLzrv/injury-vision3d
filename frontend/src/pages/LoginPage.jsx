import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
		return <Navigate to="/dashboard" replace />;
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setSubmitting(true);
		setErrorMessage('');

		try {
			await login({ email, password });
			navigate('/dashboard');
		} catch (error) {
			setErrorMessage(error.message || 'Login failed. Please try again.');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="flex min-h-dvh items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
			<div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl">
				<h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
				<p className="mt-2 text-sm text-slate-400">
					Welcome back to InjuryVision 3D
				</p>

				{infoMessage && (
					<p className="mt-4 rounded-lg border border-emerald-800/50 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">
						{infoMessage}
					</p>
				)}

				<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="email"
							className="mb-1 block text-sm font-medium text-slate-300"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							required
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-emerald-500/0 focus:ring-2"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="mb-1 block text-sm font-medium text-slate-300"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							required
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-emerald-500/0 focus:ring-2"
							placeholder="••••••••"
						/>
					</div>

					{errorMessage && (
						<p className="rounded-lg border border-red-800/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
							{errorMessage}
						</p>
					)}

					<button
						type="submit"
						disabled={submitting}
						className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{submitting ? 'Signing in...' : 'Sign in'}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-slate-400">
					No account yet?{' '}
					<Link to="/register" className="text-emerald-400 hover:text-emerald-300">
						Create one
					</Link>
				</p>
			</div>
		</div>
	);
}
