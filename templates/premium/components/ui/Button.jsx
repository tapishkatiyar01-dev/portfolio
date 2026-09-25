'use client';

import { motion } from 'framer-motion';

export default function Button({ children, primary = false, type = 'button', onClick }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`premium-button${primary ? ' premium-button-primary' : ''}`}
    >
      {children}
    </motion.button>
  );
}
