import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface LiquidButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export function LiquidButton({ 
  children, 
  onClick, 
  className = '',
  variant = 'primary',
  size = 'md'
}: LiquidButtonProps) {
  const variants = {
    primary: {
      bg: '#CBA135',
      text: '#121212',
      glow: 'rgba(203, 161, 53, 0.5)'
    },
    secondary: {
      bg: '#8B7355',
      text: '#F5F5F5',
      glow: 'rgba(139, 115, 85, 0.5)'
    },
    success: {
      bg: '#10B981',
      text: '#121212',
      glow: 'rgba(16, 185, 129, 0.5)'
    }
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };

  const config = variants[variant];

  return (
    <motion.button
      onClick={onClick}
      className={`relative overflow-hidden rounded-full ${sizes[size]} ${className}`}
      style={{
        background: config.bg,
        color: config.text,
      }}
      whileHover="hover"
      whileTap="tap"
      initial="initial"
    >
      {/* Liquid blob 1 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '150%',
          height: '150%',
          background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
        }}
        variants={{
          initial: {
            top: '-100%',
            left: '-25%',
          },
          hover: {
            top: '-50%',
            left: '-25%',
          },
        }}
        transition={{
          duration: 0.6,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
      />

      {/* Liquid blob 2 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '120%',
          height: '120%',
          background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
        }}
        variants={{
          initial: {
            bottom: '-100%',
            right: '-20%',
          },
          hover: {
            bottom: '-40%',
            right: '-20%',
          },
        }}
        transition={{
          duration: 0.8,
          ease: [0.43, 0.13, 0.23, 0.96],
          delay: 0.1,
        }}
      />

      {/* Liquid blob 3 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)`,
        }}
        variants={{
          initial: {
            top: '50%',
            left: '-50%',
            opacity: 0,
          },
          hover: {
            top: '50%',
            left: '0%',
            opacity: 1,
          },
        }}
        transition={{
          duration: 0.5,
          ease: 'easeOut',
        }}
      />

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: `2px solid ${config.bg}`,
          opacity: 0,
        }}
        variants={{
          tap: {
            scale: [1, 1.5],
            opacity: [0.5, 0],
          },
        }}
        transition={{
          duration: 0.6,
        }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)`,
        }}
        variants={{
          initial: {
            x: '-100%',
          },
          hover: {
            x: '100%',
          },
        }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        variants={{
          hover: {
            scale: 1.05,
          },
          tap: {
            scale: 0.95,
          },
        }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}
