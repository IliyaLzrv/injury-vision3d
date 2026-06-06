import { useEffect, useState } from 'react';
import { injuryApi } from '../../api/injuryApi.js';
import { BODY_PART_LABELS } from '../body/bodyParts.js';

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
	'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none ring-emerald-500/0 focus:ring-2';

export default function EditInjuryLogModal({
	isOpen,
	onClose,
	injuryLog,
	onSuccess,
}) {
	const [injuryType, setInjuryType] = useState('PAIN');
	const [painLevel, setPainLevel] = useState('5');
	const [recoveryStatus, setRecoveryStatus] = useState('ACTIVE');
	const [notes, setNotes] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		if (!isOpen || !injuryLog) {
			return;
		}

		setInjuryType(injuryLog.injuryType ?? 'PAIN');
		setPainLevel(String(injuryLog.painLevel ?? 5));
		setRecoveryStatus(injuryLog.recoveryStatus ?? 'ACTIVE');
		setNotes(injuryLog.notes ?? '');
		setSubmitting(false);
		setErrorMessage('');
	}, [isOpen, injuryLog]);

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

	if (!isOpen || !injuryLog) {
		return null;
	}

	const bodyPartLabel =
		BODY_PART_LABELS[injuryLog.bodyPart] ?? injuryLog.bodyPart;

	async function handleSubmit(event) {
		event.preventDefault();
		setSubmitting(true);
		setErrorMessage('');

		try {
			const updated = await injuryApi.updateInjuryLog(injuryLog.id, {
				injuryType,
				painLevel: Number(painLevel),
				recoveryStatus,
				notes: notes.trim() || null,
			});

			onSuccess?.(updated);
			onClose?.();
		} catch (error) {
			if (error.errors) {
				const messages = Object.values(error.errors).join(' ');
				setErrorMessage(messages || error.message);
			} else {
				setErrorMessage(error.message || 'Failed to update injury log.');
			}
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-8"
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
				aria-labelledby="edit-injury-log-title"
				className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-xl"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-start justify-between gap-4">
					<div>
						<h2
							id="edit-injury-log-title"
							className="text-xl font-semibold text-slate-100"
						>
							Update Injury Log
						</h2>
						<p className="mt-1 text-sm text-slate-400">
							Body part:{' '}
							<span className="font-medium text-slate-200">{bodyPartLabel}</span>
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						disabled={submitting}
						className="rounded-lg border border-slate-700 px-2 py-1 text-sm text-slate-400 transition hover:text-slate-200 disabled:opacity-50"
						aria-label="Close"
					>
						Close
					</button>
				</div>

				<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="edit-injuryType"
							className="mb-1 block text-sm font-medium text-slate-300"
						>
							Injury type
						</label>
						<select
							id="edit-injuryType"
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
							htmlFor="edit-painLevel"
							className="mb-1 block text-sm font-medium text-slate-300"
						>
							Pain level (1–10)
						</label>
						<input
							id="edit-painLevel"
							type="number"
							min={1}
							max={10}
							required
							value={painLevel}
							onChange={(event) => setPainLevel(event.target.value)}
							className={inputClassName}
						/>
					</div>

					<div>
						<label
							htmlFor="edit-recoveryStatus"
							className="mb-1 block text-sm font-medium text-slate-300"
						>
							Recovery status
						</label>
						<select
							id="edit-recoveryStatus"
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
							htmlFor="edit-notes"
							className="mb-1 block text-sm font-medium text-slate-300"
						>
							Notes <span className="text-slate-500">(optional)</span>
						</label>
						<textarea
							id="edit-notes"
							rows={3}
							maxLength={2000}
							value={notes}
							onChange={(event) => setNotes(event.target.value)}
							placeholder="Update how you are feeling during recovery"
							className={`${inputClassName} resize-y`}
						/>
					</div>

					{errorMessage && (
						<p className="rounded-lg border border-red-800/50 bg-red-950/30 px-3 py-2 text-sm text-red-200">
							{errorMessage}
						</p>
					)}

					<p className="text-xs text-slate-500">
						For sports self-tracking and recovery awareness only — not medical
						diagnosis.
					</p>

					<div className="flex gap-3 pt-1">
						<button
							type="button"
							onClick={onClose}
							disabled={submitting}
							className="flex-1 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={submitting}
							className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
						>
							{submitting ? 'Updating…' : 'Save changes'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
