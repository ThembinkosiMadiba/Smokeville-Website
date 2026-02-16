import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useAuth } from '../../contexts/AuthContext';
import { createBooking } from '../../services/bookingService';
import { sendBookingConfirmation, sendAdminBookingNotification } from '../../services/emailService';
import { toast } from 'sonner@2.0.3';

export function BookingsPage() {
  const { currentUser, userData } = useAuth();
  const [formData, setFormData] = useState({
    name: userData?.displayName || '',
    email: currentUser?.email || '',
    phone: userData?.phoneNumber || '',
    date: '',
    time: '',
    guests: '',
    occasion: '',
    specialRequests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || !userData) {
      toast.error('Please login to make a booking');
      return;
    }

    if (!formData.date || !formData.time || !formData.guests || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        userName: formData.name || userData.displayName || 'Guest',
        phoneNumber: formData.phone,
        date: new Date(formData.date),
        time: formData.time,
        guests: parseInt(formData.guests),
        occasion: formData.occasion,
        specialRequests: formData.specialRequests,
        status: 'pending' as const,
      };

      const bookingId = await createBooking(bookingData);
      
      toast.success('Booking request submitted!', {
        description: 'We will confirm your reservation shortly.',
      });

      // Send email notifications
      const emailData = {
        customerName: formData.name || userData.displayName || 'Guest',
        customerEmail: currentUser.email || '',
        bookingId: bookingId,
        date: new Date(formData.date).toLocaleDateString('en-ZA', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        time: formData.time,
        guests: parseInt(formData.guests),
        occasion: formData.occasion,
        specialRequests: formData.specialRequests,
        phoneNumber: formData.phone,
      };

      // Send emails in parallel (don't wait for them)
      Promise.all([
        sendBookingConfirmation(emailData),
        sendAdminBookingNotification(emailData),
      ]).then(() => {
        toast.success('Confirmation email sent!');
      }).catch(() => {
        console.log('Email notification failed (non-critical)');
      });

      // Reset form
      setFormData({
        name: userData?.displayName || '',
        email: currentUser?.email || '',
        phone: userData?.phoneNumber || '',
        date: '',
        time: '',
        guests: '',
        occasion: '',
        specialRequests: '',
      });

    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[40vh] flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1698280954292-c955f882486f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwdGFibGUlMjBlbGVnYW50fGVufDF8fHx8MTc2MDcwMDQxMXww&ixlib=rb-4.1.0&q=80&w=1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#121212]/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl mb-4 text-[#F5F5F5]">
            Reserve Your Table
          </h1>
          <p className="text-xl text-[#CBA135]">
            Create unforgettable dining memories
          </p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 lg:p-12">
            <h2 className="text-3xl mb-8 text-[#CBA135]">Book Your Experience</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#F5F5F5]">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  placeholder="John Doe"
                  className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#F5F5F5]">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    placeholder="john@example.com"
                    className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#F5F5F5]">
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    required
                    placeholder="+27 12 345 6789"
                    className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-[#F5F5F5]">
                    Date *
                  </Label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      required
                      className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5]"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CBA135] pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="text-[#F5F5F5]">
                    Time *
                  </Label>
                  <Select value={formData.time} onValueChange={(value) => handleChange('time', value)} required>
                    <SelectTrigger className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5]">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="13:00">1:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                      <SelectItem value="18:00">6:00 PM</SelectItem>
                      <SelectItem value="19:00">7:00 PM</SelectItem>
                      <SelectItem value="20:00">8:00 PM</SelectItem>
                      <SelectItem value="21:00">9:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests" className="text-[#F5F5F5]">
                  Number of Guests *
                </Label>
                <Select value={formData.guests} onValueChange={(value) => handleChange('guests', value)} required>
                  <SelectTrigger className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5]">
                    <SelectValue placeholder="Select guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </SelectItem>
                    ))}
                    <SelectItem value="9+">9+ Guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occasion" className="text-[#F5F5F5]">
                  Special Occasion (Optional)
                </Label>
                <Input
                  id="occasion"
                  value={formData.occasion}
                  onChange={(e) => handleChange('occasion', e.target.value)}
                  placeholder="Birthday, Anniversary, etc."
                  className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests" className="text-[#F5F5F5]">
                  Special Requests (Optional)
                </Label>
                <Textarea
                  id="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleChange('specialRequests', e.target.value)}
                  placeholder="Any dietary requirements, seating preferences, etc."
                  rows={3}
                  className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/40 resize-none"
                />
              </div>

              {!currentUser ? (
                <div className="bg-[#CBA135]/10 border border-[#CBA135]/30 rounded-lg p-4 text-center">
                  <p className="text-[#F5F5F5] mb-3">Please login to make a booking</p>
                  <Button
                    onClick={() => window.location.href = '#login'}
                    className="bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
                  >
                    Login / Sign Up
                  </Button>
                </div>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212] py-6"
                >
                  {isSubmitting ? 'Submitting...' : 'Book My Table'}
                </Button>
              )}
            </form>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <div
              className="rounded-2xl overflow-hidden h-64 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1698280954292-c955f882486f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwdGFibGUlMjBlbGVnYW50fGVufDF8fHx8MTc2MDcwMDQxMXww&ixlib=rb-4.1.0&q=80&w=1080)',
              }}
            >
              <div className="w-full h-full bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />
            </div>

            <div className="bg-[#1a1a1a] rounded-2xl p-8 space-y-6">
              <div>
                <h3 className="text-xl mb-2 text-[#CBA135]">Opening Hours</h3>
                <div className="space-y-1 text-[#F5F5F5]/80 text-sm">
                  <p>Tuesday: Closed</p>
                  <p>Wednesday - Thursday: 10:00 AM - 8:00 PM</p>
                  <p>Friday - Sunday: 10:00 AM - 10:00 PM</p>
                  <p>Monday: 10:00 AM - 8:00 PM</p>
                </div>
              </div>

              <div className="border-t border-[#CBA135]/20 pt-6">
                <h3 className="text-xl mb-2 text-[#CBA135]">Contact</h3>
                <div className="space-y-1 text-[#F5F5F5]/80 text-sm">
                  <p>011 982 1001</p>
                  <p className="pt-2">881 Motlana St</p>
                  <p>Orlando West, Soweto, 1804</p>
                </div>
              </div>

              <div className="border-t border-[#CBA135]/20 pt-6">
                <h3 className="text-xl mb-2 text-[#CBA135]">Service Options</h3>
                <ul className="space-y-2 text-[#F5F5F5]/80 text-sm list-disc list-inside">
                  <li>All You Can Eat available</li>
                  <li>Outdoor Seating</li>
                  <li>Private Dining Room for special events</li>
                  <li>Reservations recommended for weekends</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
