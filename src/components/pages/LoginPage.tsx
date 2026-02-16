import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { motion } from 'motion/react';
import { Check, Loader2, Chrome } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loginState, setLoginState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoginState('loading');
    
    try {
      await login(formData.email, formData.password);
      setLoginState('success');
      toast.success('Welcome back to SMOKEVILLE!');
      
      // Transition to home after success animation
      setTimeout(() => {
        onNavigate('home');
      }, 1000);
    } catch (error: any) {
      setLoginState('idle');
      let errorMessage = 'Failed to login. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoginState('loading');
      await loginWithGoogle();
      setLoginState('success');
      toast.success('Welcome to SMOKEVILLE!');
      
      setTimeout(() => {
        onNavigate('home');
      }, 1000);
    } catch (error: any) {
      setLoginState('idle');
      const errorMessage = 'Failed to login with Google. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-candles-burning-in-a-restaurant-4082-large.mp4" type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 bg-[#121212]/80 backdrop-blur-sm" />

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#1a1a1a]/80 backdrop-blur-md rounded-2xl p-8 border border-[#CBA135]/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="smokeville-logo text-2xl sm:text-3xl mb-2 text-[#CBA135]">
              SMOKEVILLE
            </h1>
            <p className="text-[#F5F5F5]/60 text-sm tracking-widest">
              Grill • Pizza • Beves
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
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
                disabled={loginState !== 'idle'}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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
                disabled={loginState !== 'idle'}
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#F5F5F5]/80 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-[#CBA135]/30 bg-[#121212] text-[#CBA135] focus:ring-[#CBA135]"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-[#CBA135] hover:text-[#B36A2E] transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                type="submit"
                disabled={loginState !== 'idle'}
                className="w-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212] py-6 relative overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(245,124,0,0.4)]"
              >
                {loginState === 'idle' && 'Login'}
                {loginState === 'loading' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Logging in...</span>
                  </motion.div>
                )}
                {loginState === 'success' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                    <span>Success!</span>
                  </motion.div>
                )}
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
              onClick={handleGoogleLogin}
              disabled={loginState !== 'idle'}
              className="border-[#CBA135]/30 text-[#F5F5F5] hover:bg-[#CBA135]/10 w-full"
            >
              <Chrome className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-[#F5F5F5]/60 mt-6">
            New to <span className="smokeville-logo text-[#CBA135]">SMOKEVILLE</span>?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="text-[#CBA135] hover:text-[#B36A2E] transition-colors"
            >
              Create an Account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
