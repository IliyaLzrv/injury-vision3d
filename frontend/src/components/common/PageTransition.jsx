import { motion } from 'framer-motion';

const variants = {
	initial: { opacity: 0, y: 12 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -8 },
};

/**
 * Wraps a route's page content with a subtle fade/slide transition.
 * Used together with <AnimatePresence> in AppRoutes so navigating
 * between pages animates instead of snapping instantly.
 */
export default function PageTransition({ children }) {
	return (
		<motion.div
			variants={variants}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{ duration: 0.22, ease: 'easeOut' }}
		>
			{children}
		</motion.div>
	);
}
