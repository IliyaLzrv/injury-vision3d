import { useState } from 'react';
import { trainingLoadApi } from '../../api/trainingLoadApi.js';

const TRAINING_TYPES = [
	{ value: 'BASKETBALL', label: 'Basketball' },
	{ value: 'GYM', label: 'Gym' },
	{ value: 'RUNNING', label: 'Running' },
	{ value: 'FOOTBALL', label: 'Football' },
	{ value: 'RECOVERY', label: 'Recovery' },
	{ value: 'OTHER', label: 'Other' },
];

const inputClassName =
	'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-teal-500/0 focus:border-teal-400 focus:ring-2';

export default function TrainingLoadForm({ onSuccess }) {
	const [trainingType, setTrainingType] = useState('RUNNING');
	const [durationMinutes, setDurationMinutes] = useState('45');
	const [intensity, setIntensity] = useState('5');
	const [notes, setNotes] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	async function handleSubmit(event) {
		event.preventDefault();
		setSubmitting(true);
		setErrorMessage('');
		setSuccessMessage('');

		try {
			await trainingLoadApi.createTrainingLoad({
				trainingType,
				durationMinutes: Number(durationMinutes),
				intensity: Number(intensity),
				notes: notes.trim() || null,
			});

			setSuccessMessage('Training session saved.');
			setNotes('');
			onSuccess?.();
		} catch (error) {
			if (error.errors) {
				const messages = Object.values(error.errors).join(' ');
				setErrorMessage(messages || error.message);
			} else {
				setErrorMessage(error.message || 'Failed to save training session.');
			}
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
			<h3 className="text-base font-semibold text-slate-900">Log training session</h3>
			<p className="mt-1 text-sm text-slate-500">
				Record self-tracked duration and intensity for recovery awareness.
			</p>

			<form className="mt-5 space-y-4" onSubmit={handleSubmit}>
				<div>
					<label
						htmlFor="trainingType"
						className="mb-1 block text-sm font-medium text-slate-700"
					>
						Training type
					</label>
					<select
						id="trainingType"
						required
						value={trainingType}
						onChange={(event) => setTrainingType(event.target.value)}
						className={inputClassName}
					>
						{TRAINING_TYPES.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>

				<div>
					<label
						htmlFor="durationMinutes"
						className="mb-1 block text-sm font-medium text-slate-700"
					>
						Duration (minutes)
					</label>
					<input
						id="durationMinutes"
						type="number"
						min={1}
						required
						value={durationMinutes}
						onChange={(event) => setDurationMinutes(event.target.value)}
						className={inputClassName}
					/>
				</div>

				<div>
					<label
						htmlFor="intensity"
						className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700"
					>
						<span>Intensity (1–10)</span>
						<span className="text-teal-700">{intensity}</span>
					</label>
					<input
						id="intensity"
						type="range"
						min={1}
						max={10}
						step={1}
						value={intensity}
						onChange={(event) => setIntensity(event.target.value)}
						className="w-full accent-teal-600"
					/>
				</div>

				<div>
					<label
						htmlFor="trainingNotes"
						className="mb-1 block text-sm font-medium text-slate-700"
					>
						Notes <span className="text-slate-400">(optional)</span>
					</label>
					<textarea
						id="trainingNotes"
						rows={3}
						maxLength={2000}
						value={notes}
						onChange={(event) => setNotes(event.target.value)}
						placeholder="How did the session feel?"
						className={`${inputClassName} resize-y`}
					/>
				</div>

				{errorMessage && (
					<p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
						{errorMessage}
					</p>
				)}

				{successMessage && (
					<p
						role="status"
						className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800"
					>
						{successMessage}
					</p>
				)}

				<button
					type="submit"
					disabled={submitting}
					className="w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-500 disabled:opacity-50"
				>
					{submitting ? 'Saving…' : 'Save training session'}
				</button>
			</form>
		</div>
	);
}
