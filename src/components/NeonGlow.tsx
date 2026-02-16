import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface NeonGlowProps {
  children: ReactNode;
  color?: string;
  intensity?: 'low' | 'medium' | 'high';
  pulse?: boolean;
  className?: string;
}

export function NeonGlow({ 
  children, 
  color = '#CBA135', 
  intensity = 'medium',
  pulse = false,
  className = '' 
}: NeonGlowProps) {
  const intensityMap = {
    low: '0 0 5px, 0 0 10px',
    medium: '0 0 10px, 0 0 20px, 0 0 30px',
    high: '0 0 10px, 0 0 20px, 0 0 40px, 0 0 80px'
  };

  const boxShadow = intensityMap[intensity]
    .split(',')
    .map(shadow => `${shadow.trim()} ${color}`)
    .join(', ');

  const pulseAnimation = pulse ? {
    boxShadow: [
      boxShadow,
      intensityMap[intensity]
        .split(',')
        .map(shadow => `${shadow.trim()} ${color}80`)
        .join(', '),
      boxShadow
    ],
  } : {};

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ boxShadow }}
      animate={pulseAnimation}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  );
}

interface NeonTextProps {
  children: ReactNode;
  color?: string;
  className?: string;
  flicker?: boolean;
}

export function NeonText({ 
  children, 
  color = '#CBA135',
  className = '',
  flicker = false
}: NeonTextProps) {
  const textShadow = `
    0 0 7px ${color},
    0 0 10px ${color},
    0 0 21px ${color},
    0 0 42px ${color}
  `;

  const flickerAnimation = flicker ? {
    opacity: [1, 0.8, 1, 0.9, 1, 0.7, 1],
    textShadow: [
      textShadow,
      `0 0 4px ${color}, 0 0 7px ${color}`,
      textShadow,
      `0 0 5px ${color}, 0 0 10px ${color}`,
      textShadow,
    ]
  } : {};

  return (
    <motion.span
      className={className}
      style={{
        textShadow,
        color: color
      }}
      animate={flickerAnimation}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: 'loop'
      }}
    >
      {children}
    </motion.span>
  );
}
