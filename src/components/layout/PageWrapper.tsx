import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';

interface PageWrapperProps {
  children: ReactNode;
  showHeader?: boolean;
  className?: string;
  bgVariant?: 'white' | 'light' | 'gradient';
}

const bgVariants: Record<string, string> = {
  white: 'bg-white',
  light: 'bg-dark-50',
  gradient: 'bg-gradient-to-b from-white to-dark-50',
};

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export default function PageWrapper({
  children,
  showHeader = true,
  className = '',
  bgVariant = 'white',
}: PageWrapperProps) {
  return (
    <div className={`min-h-screen ${bgVariants[bgVariant]}`}>
      {showHeader && <Header />}
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.main>
    </div>
  );
}

