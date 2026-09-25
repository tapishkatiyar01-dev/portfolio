import { motion } from 'framer-motion';

export default function Badge({ children }) {
  return <motion.span className="premium-tag" whileHover={{ y: -2, scale: 1.04 }} transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.span>;
}
