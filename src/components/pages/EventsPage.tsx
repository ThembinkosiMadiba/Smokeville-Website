import { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Input } from '../ui/input';

interface EventsPageProps {
  onNavigate: (page: string) => void;
}

export function EventsPage({ onNavigate }: EventsPageProps) {
  const [email, setEmail] = useState('');

  const events = {
    liveMusic: [
      {
        title: 'Live Jazz Night',
        date: 'Every Friday',
        time: '8:00 PM - 11:00 PM',
        image: 'https://images.unsplash.com/photo-1693948923846-39cf292b698d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjByZXN0YXVyYW50fGVufDF8fHx8MTc2MDcwMDQxMXww&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Enjoy smooth jazz with our signature cocktails and fine dining',
      },
      {
        title: 'Acoustic Sunday Sessions',
        date: 'Every Sunday',
        time: '3:00 PM - 6:00 PM',
        image: 'https://images.unsplash.com/photo-1653205580794-309d27d8c1c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZGFyayUyMGVsZWdhbnR8ZW58MXx8fHwxNzYwNzAwNDA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Relax to acoustic melodies while enjoying our Sunday brunch menu',
      },
    ],
    tastings: [
      {
        title: 'Wine & Dine Experience',
        date: 'First Saturday Monthly',
        time: '7:00 PM - 10:00 PM',
        image: 'https://images.unsplash.com/photo-1620818309871-6255570324d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGJhciUyMGRhcmt8ZW58MXx8fHwxNzYwNzAwNDA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        description: '5-course menu paired with premium South African wines',
      },
      {
        title: 'Whiskey Tasting Evening',
        date: 'Last Thursday Monthly',
        time: '6:30 PM - 9:00 PM',
        image: 'https://images.unsplash.com/photo-1620818309871-6255570324d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGJhciUyMGRhcmt8ZW58MXx8fHwxNzYwNzAwNDA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Explore rare whiskeys with our expert sommelier',
      },
    ],
    private: [
      {
        title: 'Chef\'s Table Experience',
        date: 'By Reservation',
        time: 'Flexible',
        image: 'https://images.unsplash.com/photo-1670819916552-67698b1c86ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGZpcmV8ZW58MXx8fHwxNzYwNzAwNDEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Intimate 8-person dining experience with our head chef',
      },
      {
        title: 'Private Events & Parties',
        date: 'Contact Us',
        time: 'Customizable',
        image: 'https://images.unsplash.com/photo-1698280954292-c955f882486f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwdGFibGUlMjBlbGVnYW50fGVufDF8fHx8MTc2MDcwMDQxMXww&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Host your special occasion in our exclusive private dining area',
      },
    ],
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for joining the SmokeCircle!');
    setEmail('');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[50vh] flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1693948923846-39cf292b698d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjByZXN0YXVyYW50fGVufDF8fHx8MTc2MDcwMDQxMXww&ixlib=rb-4.1.0&q=80&w=1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#121212]/70" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl mb-4 text-[#F5F5F5]">
            An Evening of Flavor, Beats & Smoke
          </h1>
          <p className="text-xl text-[#CBA135]">
            Experience more than just dining
          </p>
        </div>
      </section>

      {/* Events Tabs */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="liveMusic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 bg-[#1a1a1a] p-1">
              <TabsTrigger
                value="liveMusic"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#CBA135] data-[state=active]:to-[#B36A2E] data-[state=active]:text-[#121212]"
              >
                Live Music
              </TabsTrigger>
              <TabsTrigger
                value="tastings"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#CBA135] data-[state=active]:to-[#B36A2E] data-[state=active]:text-[#121212]"
              >
                Tastings
              </TabsTrigger>
              <TabsTrigger
                value="private"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#CBA135] data-[state=active]:to-[#B36A2E] data-[state=active]:text-[#121212]"
              >
                Private Parties
              </TabsTrigger>
            </TabsList>

            <TabsContent value="liveMusic" className="space-y-6">
              {events.liveMusic.map((event, index) => (
                <EventCard key={index} event={event} onNavigate={onNavigate} />
              ))}
            </TabsContent>

            <TabsContent value="tastings" className="space-y-6">
              {events.tastings.map((event, index) => (
                <EventCard key={index} event={event} onNavigate={onNavigate} />
              ))}
            </TabsContent>

            <TabsContent value="private" className="space-y-6">
              {events.private.map((event, index) => (
                <EventCard key={index} event={event} onNavigate={onNavigate} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-[#0a0a0a]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl mb-4 text-[#CBA135]">Join the SmokeCircle</h2>
          <p className="text-[#F5F5F5]/80 mb-8">
            Get exclusive invites to special events, tastings, and VIP experiences
          </p>

          <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-[#1a1a1a] border-[#CBA135]/30 text-[#F5F5F5] placeholder:text-[#F5F5F5]/40"
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212] whitespace-nowrap"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

interface EventCardProps {
  event: {
    title: string;
    date: string;
    time: string;
    image: string;
    description: string;
  };
  onNavigate: (page: string) => void;
}

function EventCard({ event, onNavigate }: EventCardProps) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0">
      <div className="aspect-[4/3] md:aspect-auto relative overflow-hidden">
        <ImageWithFallback
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-8 flex flex-col justify-center">
        <h3 className="text-2xl md:text-3xl mb-4 text-[#F5F5F5]">{event.title}</h3>
        <p className="text-[#F5F5F5]/70 mb-6">{event.description}</p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-[#CBA135]">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-[#CBA135]">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-[#CBA135]">
            <MapPin className="w-4 h-4" />
            <span className="text-sm smokeville-logo">SMOKEVILLE, Soweto</span>
          </div>
        </div>

        <Button
          onClick={() => window.open('https://webticket.co.za', '_blank')}
          className="bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
        >
          Purchase a Ticket
        </Button>
      </div>
    </div>
  );
}
