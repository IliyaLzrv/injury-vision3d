import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthPageLayout, {
	authInputClassName,
} from '../components/layout/AuthPageLayout.jsx';
import { buttonStyles } from '../components/ui/buttonStyles.js';
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
		return <Navigate to="/body-map" replace />;
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setSubmitting(true);
		setErrorMessage('');

		try {
			await register({ fullName, email, password });
			navigate('/body-map');
		} catch (error) {
			setErrorMessage(formatRegisterErrors(error));
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<AuthPageLayout
			title="Create account"
			subtitle="Start sports self-tracking and recovery awareness with InjuryVision 3D"
			footer={
				<p className="mt-6 text-center text-sm text-slate-500">
					Already have an account?{' '}
					<Link to="/login" className="font-medium text-sky-600 hover:text-sky-500">
						Sign in
					</Link>
				</p>
			}
		>
			<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
				<div>
					<label
						htmlFor="fullName"
						className="mb-1 block text-sm font-medium text-slate-700"
					>
						Full name
					</label>
					<input
						id="fullName"
						type="text"
						required
						value={fullName}
						onChange={(event) => setFullName(event.target.value)}
						className={authInputClassName}
						placeholder="Alex Runner"
					/>
				</div>

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
						minLength={6}
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						className={authInputClassName}
						placeholder="At least 6 characters"
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
					{submitting ? 'Creating account…' : 'Create account'}
				</button>
			</form>
		</AuthPageLayout>
	);
}
