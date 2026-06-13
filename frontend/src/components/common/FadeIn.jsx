import { motion } from 'framer-motion';

/**
 * Fades and slides content in as it scrolls into view (or on initial
 * mount for above-the-fold content). `delay` can be used to stagger a
 * sequence of siblings.
 */
export default function FadeIn({ children, delay = 0, className }) {
	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-40px' }}
			transition={{ duration: 0.4, ease: 'easeOut', delay }}
		>
			{children}
		</motion.div>
	);
}
