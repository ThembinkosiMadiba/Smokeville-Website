import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { motion } from 'motion/react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPulse((prev) => !prev);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[40vh] flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1670819916552-67698b1c86ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGZpcmV8ZW58MXx8fHwxNzYwNzAwNDEwfDA&ixlib=rb-4.1.0&q=80&w=1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#121212]/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl mb-4 text-[#F5F5F5]">Get in Touch</h1>
          <p className="text-xl text-[#CBA135]">We'd love to hear from you</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 lg:p-12">
            <h2 className="text-3xl mb-8 text-[#CBA135]">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#F5F5F5]">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  placeholder="Your name"
                  className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#F5F5F5]">
                  Email *
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-[#F5F5F5]">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, message: e.target.value }))
                  }
                  required
                  placeholder="How can we help you?"
                  rows={6}
                  className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/40"
                />
              </div>

              <motion.div
                animate={showPulse ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212] py-6 transition-all hover:shadow-[0_0_20px_rgba(255,136,0,0.4)] hover:-translate-y-1"
                >
                  Send Message
                </Button>
              </motion.div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Map Placeholder */}
            <div className="bg-[#1a1a1a] rounded-2xl h-64 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.0392842394586!2d27.91876!3d-26.23333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e950c1c8b1c8b1f%3A0x1234567890abcdef!2s881%20Motlana%20St%2C%20Orlando%20West%2C%20Soweto%2C%201804!5e0!3m2!1sen!2sza!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="SMOKEVILLE Location"
              />
            </div>

            {/* Contact Details */}
            <div className="bg-[#1a1a1a] rounded-2xl p-8 space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#CBA135] to-[#B36A2E] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#121212]" />
                </div>
                <div>
                  <h3 className="text-lg mb-1 text-[#CBA135]">Location</h3>
                  <p className="text-[#F5F5F5]/80 text-sm">
                    881 Motlana St
                    <br />
                    Orlando West, Soweto
                    <br />
                    1804, South Africa
                  </p>
                </div>
              </div>

              <div className="border-t border-[#CBA135]/20 pt-6 flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#CBA135] to-[#B36A2E] rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#121212]" />
                </div>
                <div>
                  <h3 className="text-lg mb-1 text-[#CBA135]">Phone</h3>
                  <p className="text-[#F5F5F5]/80 text-sm">
                    011 982 1001
                  </p>
                </div>
              </div>

              <div className="border-t border-[#CBA135]/20 pt-6">
                <h3 className="text-lg mb-3 text-[#CBA135]">Service Options</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#CBA135]/20 rounded-full text-[#F5F5F5]/80 text-sm border border-[#CBA135]/30">
                    🍽️ All You Can Eat
                  </span>
                  <span className="px-3 py-1 bg-[#CBA135]/20 rounded-full text-[#F5F5F5]/80 text-sm border border-[#CBA135]/30">
                    🌳 Outdoor Seating
                  </span>
                  <span className="px-3 py-1 bg-[#CBA135]/20 rounded-full text-[#F5F5F5]/80 text-sm border border-[#CBA135]/30">
                    🚪 Private Dining Room
                  </span>
                </div>
              </div>

              <div className="border-t border-[#CBA135]/20 pt-6 flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#CBA135] to-[#B36A2E] rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#121212]" />
                </div>
                <div>
                  <h3 className="text-lg mb-1 text-[#CBA135]">Hours</h3>
                  <div className="text-[#F5F5F5]/80 text-sm space-y-1">
                    <p>Tuesday: Closed</p>
                    <p>Wed-Thu: 10:00 AM - 8:00 PM</p>
                    <p>Fri-Sun: 10:00 AM - 10:00 PM</p>
                    <p>Monday: 10:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
