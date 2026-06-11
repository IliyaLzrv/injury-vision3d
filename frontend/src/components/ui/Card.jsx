import { cardClassName } from './cardStyles.js';
import { cn } from './buttonStyles.js';

export default function Card({
	children,
	className = '',
	padding = true,
	...props
}) {
	return (
		<div
			className={cn(cardClassName, !padding && 'p-0', className)}
			{...props}
		>
			{children}
		</div>
	);
}
