import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat, 
  Flame, 
  Package, 
  Bike, 
  CheckCircle2, 
  Clock,
  MapPin,
  Phone
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'cooking' | 'ready' | 'out-for-delivery' | 'delivered' | 'completed';

interface OrderTrackerProps {
  orderId: string;
  status: OrderStatus;
  orderType: 'delivery' | 'pickup' | 'dine-in';
  estimatedTime?: number; // in minutes
  deliveryAddress?: string;
  driverName?: string;
  driverPhone?: string;
  items?: Array<{ name: string; quantity: number }>;
}

const statusSteps: { [key in OrderStatus]: number } = {
  'pending': 0,
  'confirmed': 1,
  'preparing': 2,
  'cooking': 3,
  'ready': 4,
  'out-for-delivery': 5,
  'delivered': 6,
  'completed': 6
};

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Order Received',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    description: 'Your order has been received'
  },
  confirmed: {
    icon: CheckCircle2,
    label: 'Confirmed',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    description: 'Order confirmed and sent to kitchen'
  },
  preparing: {
    icon: Package,
    label: 'Preparing',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    description: 'Chef is preparing your ingredients'
  },
  cooking: {
    icon: Flame,
    label: 'Cooking',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    description: 'Your food is being cooked'
  },
  ready: {
    icon: ChefHat,
    label: 'Ready',
    color: 'text-[#CBA135]',
    bgColor: 'bg-[#CBA135]/10',
    description: 'Your order is ready'
  },
  'out-for-delivery': {
    icon: Bike,
    label: 'Out for Delivery',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    description: 'Driver is on the way'
  },
  delivered: {
    icon: CheckCircle2,
    label: 'Delivered',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    description: 'Order has been delivered'
  },
  completed: {
    icon: CheckCircle2,
    label: 'Completed',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    description: 'Order completed'
  }
};

export function OrderTracker({
  orderId,
  status,
  orderType,
  estimatedTime = 30,
  deliveryAddress,
  driverName,
  driverPhone,
  items = []
}: OrderTrackerProps) {
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(estimatedTime);
  const [pulseActive, setPulseActive] = useState(true);

  const currentStep = statusSteps[status];
  const config = statusConfig[status];
  const Icon = config.icon;

  useEffect(() => {
    // Animate progress bar
    const targetProgress = (currentStep / 6) * 100;
    setProgress(targetProgress);
  }, [currentStep]);

  useEffect(() => {
    // Countdown timer
    if (status === 'delivered' || status === 'completed') return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    // Pulse animation
    const pulseInterval = setInterval(() => {
      setPulseActive(prev => !prev);
    }, 1000);

    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <Card className="bg-zinc-900 border-zinc-800 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl mb-1">Order #{orderId.slice(-6).toUpperCase()}</h3>
            <p className="text-sm text-zinc-400">
              {orderType === 'delivery' ? 'Delivery' : orderType === 'pickup' ? 'Pickup' : 'Dine-in'}
            </p>
          </div>
          <Badge className={`${config.bgColor} ${config.color} border-none`}>
            {config.label}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Progress</span>
            <span className="text-[#CBA135]">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Status with Animation */}
        <motion.div
          className={`${config.bgColor} rounded-lg p-4 border border-zinc-800`}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-4">
            <motion.div
              animate={{
                scale: pulseActive ? 1.1 : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              <div className={`${config.color} p-3 rounded-full bg-black/20`}>
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
            <div className="flex-1">
              <h4 className={`${config.color} mb-1`}>{config.label}</h4>
              <p className="text-sm text-zinc-400">{config.description}</p>
              
              {status !== 'delivered' && status !== 'completed' && (
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <Clock className="w-4 h-4 text-[#CBA135]" />
                  <span className="text-zinc-300">
                    Est. {timeRemaining} minutes
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="space-y-3">
          <h4 className="text-sm text-zinc-400">Order Timeline</h4>
          <div className="space-y-2">
            {Object.entries(statusConfig).map(([key, stepConfig], index) => {
              const StepIcon = stepConfig.icon;
              const stepNumber = statusSteps[key as OrderStatus];
              const isCompleted = stepNumber <= currentStep;
              const isCurrent = stepNumber === currentStep;
              
              // Skip delivery step for non-delivery orders
              if (key === 'out-for-delivery' && orderType !== 'delivery') {
                return null;
              }

              return (
                <motion.div
                  key={key}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative">
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        isCompleted
                          ? 'bg-[#CBA135] border-[#CBA135]'
                          : 'bg-zinc-800 border-zinc-700'
                      }`}
                      animate={{
                        scale: isCurrent ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        duration: 1,
                        repeat: isCurrent ? Infinity : 0,
                      }}
                    >
                      <StepIcon className={`w-4 h-4 ${isCompleted ? 'text-black' : 'text-zinc-500'}`} />
                    </motion.div>
                    
                    {index < Object.keys(statusConfig).length - 2 && (
                      <div
                        className={`absolute left-1/2 top-8 w-0.5 h-6 -translate-x-1/2 ${
                          isCompleted ? 'bg-[#CBA135]' : 'bg-zinc-800'
                        }`}
                      />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`text-sm ${isCompleted ? 'text-white' : 'text-zinc-500'}`}>
                      {stepConfig.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Delivery Info */}
        {orderType === 'delivery' && (status === 'out-for-delivery' || status === 'delivered') && (
          <AnimatePresence>
            <motion.div
              className="bg-zinc-800 rounded-lg p-4 space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h4 className="text-sm text-[#CBA135]">Delivery Information</h4>
              
              {deliveryAddress && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-zinc-400 mt-0.5" />
                  <span className="text-zinc-300">{deliveryAddress}</span>
                </div>
              )}
              
              {driverName && (
                <div className="flex items-center gap-2 text-sm">
                  <Bike className="w-4 h-4 text-zinc-400" />
                  <span className="text-zinc-300">Driver: {driverName}</span>
                </div>
              )}
              
              {driverPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-zinc-400" />
                  <span className="text-zinc-300">{driverPhone}</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Items Summary */}
        {items.length > 0 && (
          <div className="bg-zinc-800 rounded-lg p-4">
            <h4 className="text-sm text-[#CBA135] mb-3">Order Items</h4>
            <div className="space-y-2">
              {items.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">{item.name}</span>
                  <span className="text-zinc-400">x{item.quantity}</span>
                </div>
              ))}
              {items.length > 3 && (
                <p className="text-xs text-zinc-500">
                  +{items.length - 3} more items
                </p>
              )}
            </div>
          </div>
        )}

        {/* Live Kitchen Activity Indicator (simulated) */}
        {(status === 'preparing' || status === 'cooking') && (
          <motion.div
            className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3"
            animate={{
              borderColor: ['rgba(249, 115, 22, 0.2)', 'rgba(249, 115, 22, 0.5)', 'rgba(249, 115, 22, 0.2)'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Flame className="w-4 h-4 text-orange-500" />
              </motion.div>
              <span className="text-sm text-orange-400">
                Kitchen is busy - {Math.floor(Math.random() * 5) + 3} orders in queue
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
}
