import { cn } from './buttonStyles.js';

const variants = {
	default: 'bg-slate-100 text-slate-700',
	primary: 'bg-sky-50 text-sky-700',
	teal: 'bg-teal-50 text-teal-700',
	green: 'bg-green-50 text-green-700',
	orange: 'bg-orange-50 text-orange-700',
	red: 'bg-red-50 text-red-700',
	indigo: 'bg-indigo-50 text-indigo-600',
	muted: 'bg-slate-100 text-slate-500',
};

export default function Badge({
	children,
	variant = 'default',
	className = '',
}) {
	return (
		<span
			className={cn(
				'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
				variants[variant] ?? variants.default,
				className
			)}
		>
			{children}
		</span>
	);
}
