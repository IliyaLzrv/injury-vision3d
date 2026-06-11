import { useEffect, useState } from 'react';
import { injuryApi } from '../../api/injuryApi.js';
import { BODY_PART_LABELS } from '../body/bodyParts.js';
import { buttonStyles } from '../ui/buttonStyles.js';

const INJURY_TYPES = [
	{ value: 'PAIN', label: 'Pain' },
	{ value: 'SPRAIN', label: 'Sprain' },
	{ value: 'STRAIN', label: 'Strain' },
	{ value: 'BRUISE', label: 'Bruise' },
	{ value: 'OTHER', label: 'Other' },
];

const RECOVERY_STATUSES = [
	{ value: 'ACTIVE', label: 'Active' },
	{ value: 'RECOVERING', label: 'Recovering' },
	{ value: 'RECOVERED', label: 'Recovered' },
];

const inputClassName =
	'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-sky-400/0 focus:border-sky-300 focus:ring-2';

export default function AddInjuryLogModal({
	isOpen,
	onClose,
	selectedBodyPart,
	onSuccess,
}) {
	const [injuryType, setInjuryType] = useState('PAIN');
	const [painLevel, setPainLevel] = useState('5');
	const [recoveryStatus, setRecoveryStatus] = useState('ACTIVE');
	const [notes, setNotes] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		setInjuryType('PAIN');
		setPainLevel('5');
		setRecoveryStatus('ACTIVE');
		setNotes('');
		setSubmitting(false);
		setErrorMessage('');
	}, [isOpen, selectedBodyPart]);

	useEffect(() => {
		if (!isOpen) {
			return undefined;
		}

		function handleKeyDown(event) {
			if (event.key === 'Escape' && !submitting) {
				onClose?.();
			}
		}

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose, submitting]);

	if (!isOpen || !selectedBodyPart) {
		return null;
	}

	const bodyPartLabel =
		BODY_PART_LABELS[selectedBodyPart] ?? selectedBodyPart;

	async function handleSubmit(event) {
		event.preventDefault();
		setSubmitting(true);
		setErrorMessage('');

		try {
			const created = await injuryApi.createInjuryLog({
				bodyPart: selectedBodyPart,
				injuryType,
				painLevel: Number(painLevel),
				recoveryStatus,
				notes: notes.trim() || null,
			});

			onSuccess?.(created);
			onClose?.();
		} catch (error) {
			if (error.errors) {
				const messages = Object.values(error.errors).join(' ');
				setErrorMessage(messages || error.message);
			} else {
				setErrorMessage(error.message || 'Failed to save injury log.');
			}
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6 backdrop-blur-sm sm:py-8"
			role="presentation"
			onClick={() => {
				if (!submitting) {
					onClose?.();
				}
			}}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="add-injury-log-title"
				className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-300/40"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-start justify-between gap-4">
					<div>
						<h2
							id="add-injury-log-title"
							className="text-xl font-semibold text-slate-900"
						>
							Add Injury Log
						</h2>
						<p className="mt-1 text-sm text-slate-500">
							Logging for:{' '}
							<span className="font-medium text-slate-800">{bodyPartLabel}</span>
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						disabled={submitting}
						className="rounded-lg border border-slate-200 px-2 py-1 text-sm text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 disabled:opacity-50"
						aria-label="Close"
					>
						×
					</button>
				</div>

				<form className="mt-6 space-y-5" onSubmit={handleSubmit}>
					<div>
						<div className="mb-2 flex items-center justify-between gap-3">
							<label
								htmlFor="painLevel"
								className="text-sm font-medium text-slate-700"
							>
								Pain level
							</label>
							<span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-sm font-semibold text-sky-700">
								{painLevel}/10
							</span>
						</div>
						<input
							id="painLevel"
							type="range"
							min={1}
							max={10}
							step={1}
							required
							value={painLevel}
							onChange={(event) => setPainLevel(event.target.value)}
							className="h-2 w-full cursor-pointer accent-sky-500"
						/>
						<div className="mt-1 flex justify-between text-[11px] text-slate-400">
							<span>1 — mild</span>
							<span>10 — severe</span>
						</div>
					</div>

					<div>
						<label
							htmlFor="injuryType"
							className="mb-1 block text-sm font-medium text-slate-700"
						>
							Injury type
						</label>
						<select
							id="injuryType"
							required
							value={injuryType}
							onChange={(event) => setInjuryType(event.target.value)}
							className={inputClassName}
						>
							{INJURY_TYPES.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor="recoveryStatus"
							className="mb-1 block text-sm font-medium text-slate-700"
						>
							Recovery progress
						</label>
						<select
							id="recoveryStatus"
							required
							value={recoveryStatus}
							onChange={(event) => setRecoveryStatus(event.target.value)}
							className={inputClassName}
						>
							{RECOVERY_STATUSES.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					<div>
						<label
							htmlFor="notes"
							className="mb-1 block text-sm font-medium text-slate-700"
						>
							Notes <span className="text-slate-400">(optional)</span>
						</label>
						<textarea
							id="notes"
							rows={3}
							maxLength={2000}
							value={notes}
							onChange={(event) => setNotes(event.target.value)}
							placeholder="What happened during training or recovery?"
							className={`${inputClassName} resize-y`}
						/>
					</div>

					{errorMessage && (
						<p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
							{errorMessage}
						</p>
					)}

					<p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
						This log is for self-tracking and recovery awareness, not clinical
						guidance.
					</p>

					<div className="flex gap-3 pt-1">
						<button
							type="button"
							onClick={onClose}
							disabled={submitting}
							className={`${buttonStyles.secondary} flex-1`}
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={submitting}
							className={`${buttonStyles.teal} flex-1`}
						>
							{submitting ? 'Saving…' : 'Save Log'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
