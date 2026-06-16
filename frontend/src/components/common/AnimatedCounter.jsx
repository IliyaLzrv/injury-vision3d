import { useEffect, useState } from 'react';

/**
 * Parses values like 12, "12", "67%", "5/10", "3.5" into a numeric part
 * plus a static suffix so the number can be animated while units stay put.
 * Returns null for values that aren't numeric (e.g. dates), which are
 * rendered as-is without animation.
 */
function parseValue(value) {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return {
			number: value,
			suffix: '',
			decimals: Number.isInteger(value) ? 0 : 1,
		};
	}

	if (typeof value === 'string') {
		const match = value.match(/^(-?\d+(?:\.\d+)?)(.*)$/);
		if (match) {
			const number = Number(match[1]);
			if (!Number.isNaN(number)) {
				const decimals = match[1].includes('.')
					? match[1].split('.')[1].length
					: 0;
				return { number, suffix: match[2], decimals };
			}
		}
	}

	return null;
}

/**
 * Animates a number counting up from 0 to its target value. Non-numeric
 * values (e.g. formatted dates) are rendered statically.
 */
export default function AnimatedCounter({ value, duration = 0.7 }) {
	const parsed = parseValue(value);
	const [display, setDisplay] = useState(parsed ? 0 : value);

	useEffect(() => {
		if (!parsed) {
			return undefined;
		}

		let frame;
		const start = performance.now();
		const target = parsed.number;

		function tick(now) {
			const elapsed = (now - start) / 1000;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - (1 - progress) ** 3;
			setDisplay(target * eased);

			if (progress < 1) {
				frame = requestAnimationFrame(tick);
			} else {
				setDisplay(target);
			}
		}

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, duration]);

	if (!parsed) {
		return value;
	}

	return `${display.toFixed(parsed.decimals)}${parsed.suffix}`;
}
