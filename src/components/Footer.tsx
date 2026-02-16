import { useState } from 'react';
import { Instagram, Facebook, Mail } from 'lucide-react';
import { ReviewSection } from './ReviewSection';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { subscribeToNewsletter } from '../services/newsletterService';
import { toast } from 'sonner@2.0.3';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubscribing(true);
    try {
      await subscribeToNewsletter(email);
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error: any) {
      if (error.message.includes('already subscribed')) {
        toast.error('This email is already subscribed');
      } else {
        toast.error('Failed to subscribe. Please try again.');
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="border-t border-[#CBA135]/20 mt-20">
      {/* Review Section */}
      <ReviewSection />
      
      {/* Footer Content */}
      <div className="bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div>
              <span className="smokeville-logo text-[#CBA135] text-xl uppercase">
                SMOKEVILLE
              </span>
              <p className="text-[#F5F5F5]/60 text-sm mt-2 tracking-wider">
                GRILL-PIZZA-BEVES
              </p>
            </div>
            <p className="text-[#F5F5F5]/60 text-sm">
              Made with Passion by <span className="smokeville-logo text-base">SMOKEVILLE</span>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#CBA135] mb-4">Quick Links</h4>
            <div className="space-y-2">
              {['Home', 'Menu', 'Order', 'Events'].map((link) => (
                <button
                  key={link}
                  onClick={() => onNavigate(link.toLowerCase())}
                  className="block text-[#F5F5F5]/80 hover:text-[#CBA135] transition-colors text-sm"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* More */}
          <div>
            <h4 className="text-[#CBA135] mb-4">More</h4>
            <div className="space-y-2">
              {['Bookings', 'Contact', 'Careers', 'About'].map((link) => (
                <button
                  key={link}
                  onClick={() => onNavigate(link.toLowerCase())}
                  className="block text-[#F5F5F5]/80 hover:text-[#CBA135] transition-colors text-sm"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#CBA135] mb-4">Visit Us</h4>
            <p className="text-[#F5F5F5]/80 text-sm mb-4">
              881 Motlana St
              <br />
              Orlando West, Soweto
              <br />
              1804, South Africa
            </p>
            <p className="text-[#F5F5F5]/80 text-sm mb-4">
              011 982 1001
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/smoke_ville_?igsh=MTk4Y2ZkYjYzMTE4aQ==" target="_blank" rel="noopener noreferrer" className="text-[#F5F5F5] hover:text-[#CBA135] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/share/1BXp564USf/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-[#F5F5F5] hover:text-[#CBA135] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-[#CBA135]/20">
          <div className="max-w-md mx-auto text-center">
            <Mail className="w-12 h-12 text-[#CBA135] mx-auto mb-4" />
            <h4 className="text-xl text-[#F5F5F5] mb-2">
              Join Our Newsletter
            </h4>
            <p className="text-[#F5F5F5]/60 text-sm mb-6">
              Get exclusive deals, event updates, and special offers delivered to your inbox
            </p>
            <form onSubmit={handleNewsletterSignup} className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isSubscribing}
                className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/40"
              />
              <Button
                type="submit"
                disabled={isSubscribing}
                className="bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212] whitespace-nowrap"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#CBA135]/20 mt-8 pt-8 text-center text-[#F5F5F5]/60 text-sm">
          © {new Date().getFullYear()} <span className="smokeville-logo">SMOKEVILLE</span>. All rights reserved.
        </div>
      </div>
      </div>
    </footer>
  );
}
