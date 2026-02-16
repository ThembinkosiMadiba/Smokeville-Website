import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';

interface MorphButtonProps {
  children: ReactNode;
  onClick?: () => void | Promise<void>;
  className?: string;
  successText?: string;
  loadingText?: string;
  icon?: ReactNode;
  successIcon?: ReactNode;
}

export function MorphButton({ 
  children, 
  onClick, 
  className = '',
  successText = 'Done!',
  loadingText = 'Processing...',
  icon,
  successIcon
}: MorphButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleClick = async () => {
    if (state !== 'idle') return;

    setState('loading');

    try {
      if (onClick) {
        await onClick();
      }
      setState('success');
      
      // Reset after 2 seconds
      setTimeout(() => {
        setState('idle');
      }, 2000);
    } catch (error) {
      setState('idle');
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      disabled={state !== 'idle'}
      layout
      initial={false}
      animate={{
        backgroundColor: state === 'success' ? '#10B981' : state === 'loading' ? '#CBA135' : '#CBA135',
        scale: state === 'success' ? [1, 1.05, 1] : 1,
      }}
      transition={{
        layout: { duration: 0.3, ease: 'easeInOut' },
        backgroundColor: { duration: 0.3 },
        scale: { duration: 0.4 },
      }}
    >
      <AnimatePresence mode="wait">
        {state === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center gap-2"
          >
            {icon}
            <span>{children}</span>
          </motion.div>
        )}

        {state === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-4 h-4" />
            </motion.div>
            <span>{loadingText}</span>
          </motion.div>
        )}

        {state === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, type: 'spring' }}
            className="flex items-center justify-center gap-2"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              {successIcon || <Check className="w-5 h-5" />}
            </motion.div>
            <span>{successText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particle burst on success */}
      {state === 'success' && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              initial={{
                top: '50%',
                left: '50%',
                opacity: 1,
              }}
              animate={{
                top: `${50 + Math.sin((i / 8) * Math.PI * 2) * 100}%`,
                left: `${50 + Math.cos((i / 8) * Math.PI * 2) * 100}%`,
                opacity: 0,
              }}
              transition={{
                duration: 0.6,
                ease: 'easeOut',
              }}
            />
          ))}
        </>
      )}
    </motion.button>
  );
}
