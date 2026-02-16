import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Chrome } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { sendWelcomeEmail } from '../../services/emailService';
import { toast } from 'sonner@2.0.3';

interface SignUpPageProps {
  onNavigate: (page: string) => void;
}

export function SignUpPage({ onNavigate }: SignUpPageProps) {
  const { signup, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (particles.length > 10) {
      setParticles((prev) => prev.slice(-10));
    }
  }, [particles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      toast.error('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    
    setLoading(true);
    try {
      await signup(formData.email, formData.password, formData.name, formData.phone);
      setShowSuccess(true);
      toast.success('Account created successfully! Welcome to SMOKEVILLE!');
      
      // Send welcome email
      sendWelcomeEmail({
        customerName: formData.name,
        customerEmail: formData.email,
      }).then(() => {
        toast.success('Welcome email sent!');
      }).catch(() => {
        console.log('Welcome email failed (non-critical)');
      });
      
      setTimeout(() => {
        onNavigate('home');
      }, 3000);
    } catch (error: any) {
      setLoading(false);
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const user = await loginWithGoogle();
      setShowSuccess(true);
      toast.success('Account created successfully! Welcome to SMOKEVILLE!');
      
      // Send welcome email
      if (user && user.email) {
        sendWelcomeEmail({
          customerName: user.displayName || 'Guest',
          customerEmail: user.email,
        }).then(() => {
          toast.success('Welcome email sent!');
        }).catch(() => {
          console.log('Welcome email failed (non-critical)');
        });
      }
      
      setTimeout(() => {
        onNavigate('home');
      }, 3000);
    } catch (error: any) {
      setLoading(false);
      const errorMessage = 'Failed to sign up with Google. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">
      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ opacity: 0, scale: 0, x: particle.x, y: particle.y }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: particle.y - 200,
          }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="absolute text-2xl pointer-events-none"
        >
          🍕
        </motion.div>
      ))}

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#121212]/90 backdrop-blur-md z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-24 h-24 mx-auto mb-6"
              >
                <Sparkles className="w-full h-full text-[#CBA135]" />
              </motion.div>
              <h2 className="text-4xl mb-4 text-[#CBA135]">Welcome to <span className="smokeville-logo">SMOKEVILLE</span>!</h2>
              <p className="text-[#F5F5F5]/80 text-lg">Your account has been created successfully</p>
              
              {/* Confetti */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0, opacity: 1 }}
                  animate={{
                    y: Math.random() * 500 - 250,
                    x: Math.random() * 400 - 200,
                    opacity: 0,
                    rotate: Math.random() * 360,
                  }}
                  transition={{ duration: 1.5, delay: i * 0.05 }}
                  className="absolute top-1/2 left-1/2 w-3 h-3 bg-[#CBA135] rounded-full"
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Side - Image */}
      <div className="hidden lg:block relative">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1670819916552-67698b1c86ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGZpcmV8ZW58MXx8fHwxNzYwNzAwNDEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Chef cooking"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#121212]/80" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <h2 className="text-4xl mb-4 text-[#F5F5F5]">
            Join the Smoke Family
          </h2>
          <p className="text-[#F5F5F5]/80 text-lg">
            Experience exclusive benefits, faster ordering, and personalized recommendations
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center px-4 py-12 bg-[#121212]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo with Lottie-style animation */}
          <motion.div
            className="text-center mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-6xl mb-4"
            >
              👨‍🍳
            </motion.div>
            <h1 className="smokeville-logo text-2xl sm:text-3xl mb-2 text-[#CBA135]">
              SMOKEVILLE
            </h1>
            <p className="text-[#F5F5F5]/60 text-sm tracking-widest">
              Grill • Pizza • Beves
            </p>
          </motion.div>

          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#CBA135]/20">
            <h2 className="text-2xl mb-6 text-[#F5F5F5]">Create Account</h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <Label htmlFor="name" className="text-[#F5F5F5]">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  placeholder="John Doe"
                  className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/40"
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-[#F5F5F5]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  placeholder="your@email.com"
                  className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/40"
                  disabled={loading}
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="space-y-2"
              >
                <Label htmlFor="phone" className="text-[#F5F5F5]">
                  Phone Number (Optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+27 123 456 7890"
                  className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/40"
                  disabled={loading}
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-[#F5F5F5]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                  placeholder="••••••••"
                  className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/40"
                  disabled={loading}
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="space-y-2"
              >
                <Label htmlFor="confirmPassword" className="text-[#F5F5F5]">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  required
                  placeholder="••••••••"
                  className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/40"
                  disabled={loading}
                />
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-400"
                >
                  {error}
                </motion.div>
              )}

              <div className="pt-2">
                <label className="flex items-start gap-2 text-sm text-[#F5F5F5]/80 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-0.5 rounded border-[#CBA135]/30 bg-[#121212] text-[#CBA135] focus:ring-[#CBA135]"
                  />
                  <span>
                    I agree to the Terms of Service and Privacy Policy
                  </span>
                </label>
              </div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212] py-6 transition-all hover:shadow-[0_0_30px_rgba(245,124,0,0.4)] hover:-translate-y-1"
                >
                  {loading ? 'Creating Account...' : 'Join the Smoke Family'}
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#CBA135]/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1a1a1a] text-[#F5F5F5]/60">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-1 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="border-[#CBA135]/30 text-[#F5F5F5] hover:bg-[#CBA135]/10 w-full"
              >
                <Chrome className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-[#F5F5F5]/60 mt-6">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-[#CBA135] hover:text-[#B36A2E] transition-colors"
              >
                Login
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
