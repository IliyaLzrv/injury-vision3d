import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function formatRegisterErrors(error) {
	if (error.errors) {
		return Object.values(error.errors).join(' ');
	}
	return error.message || 'Registration failed. Please try again.';
}

export default function RegisterPage() {
	const { register, isAuthenticated, loading } = useAuth();
	const navigate = useNavigate();

	const [fullName, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	if (!loading && isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setSubmitting(true);
		setErrorMessage('');

		try {
			const response = await register({ fullName, email, password });

			if (response.token) {
				navigate('/dashboard');
			} else {
				navigate('/login', {
					state: {
						message: 'Account created successfully. Please sign in.',
					},
				});
			}
		} catch (error) {
			setErrorMessage(formatRegisterErrors(error));
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="flex min-h-dvh items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
			<div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl">
				<h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
				<p className="mt-2 text-sm text-slate-400">
					Start tracking your recovery with InjuryVision 3D
				</p>

				<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="fullName"
							className="mb-1 block text-sm font-medium text-slate-300"
						>
							Full name
						</label>
						<input
							id="fullName"
							type="text"
							required
							value={fullName}
							onChange={(event) => setFullName(event.target.value)}
							className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
							placeholder="Alex Runner"
						/>
					</div>

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
							className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
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
							minLength={6}
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50"
							placeholder="At least 6 characters"
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
						{submitting ? 'Creating account...' : 'Create account'}
					</button>
				</form>

				<p className="mt-6 text-center text-sm text-slate-400">
					Already have an account?{' '}
					<Link to="/login" className="text-emerald-400 hover:text-emerald-300">
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
