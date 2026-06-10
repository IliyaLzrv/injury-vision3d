import { cn } from './buttonStyles.js';

export default function Card({
	children,
	className = '',
	padding = true,
	...props
}) {
	return (
		<div
			className={cn(
				'rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60',
				padding && 'p-6',
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}
