import { Search, Star, ChevronLeft, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { LiquidButton } from '../LiquidButton';
import { MagneticButton } from '../MagneticButton';
import { NeonGlow } from '../NeonGlow';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [currentDish, setCurrentDish] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const smokeY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const popularDishes = [
    {
      name: 'Signature Lentil Stew',
      image: 'https://images.unsplash.com/photo-1711915408847-ae32b80a3fd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW50aWwlMjBzdGV3JTIwYm93bHxlbnwxfHx8fDE3NjA3MDA0MTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Slow-cooked with smoky spices',
    },
    {
      name: 'Grilled Ribs',
      image: 'https://images.unsplash.com/photo-1594266063697-304befca9629?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwcmlicyUyMHNtb2tlfGVufDF8fHx8MTc2MDcwMDQwOXww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Fall-off-the-bone perfection',
    },
    {
      name: 'Wood-Fired Pizza',
      image: 'https://images.unsplash.com/photo-1689010039458-c605ea68c0b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcGl6emElMjB3b29kJTIwZmlyZXxlbnwxfHx8fDE3NjA3MDA0MDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Authentic Italian style',
    },
    {
      name: 'Smokehouse Burger',
      image: 'https://images.unsplash.com/photo-1554306297-0c86e837d24b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBncmlsbHxlbnwxfHx8fDE3NjA3MDA0MTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Premium beef, house sauce',
    },
  ];

  const events = [
    {
      title: 'Live Jazz Night',
      image: 'https://images.unsplash.com/photo-1693948923846-39cf292b698d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjByZXN0YXVyYW50fGVufDF8fHx8MTc2MDcwMDQxMXww&ixlib=rb-4.1.0&q=80&w=1080',
      date: 'Every Friday',
    },
    {
      title: 'Wine Tasting',
      image: 'https://images.unsplash.com/photo-1620818309871-6255570324d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGJhciUyMGRhcmt8ZW58MXx8fHwxNzYwNzAwNDA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: 'Monthly',
    },
    {
      title: 'Chef\'s Table',
      image: 'https://images.unsplash.com/photo-1670819916552-67698b1c86ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGZpcmV8ZW58MXx8fHwxNzYwNzAwNDEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: 'By Reservation',
    },
  ];

  const nextDish = () => {
    setCurrentDish((prev) => (prev + 1) % popularDishes.length);
  };

  const prevDish = () => {
    setCurrentDish((prev) => (prev - 1 + popularDishes.length) % popularDishes.length);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate floating embers/smoke particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
    color: i % 3 === 0 ? '#ff6b35' : i % 3 === 1 ? '#f7931e' : '#CBA135',
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Chef Image Background */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1737324086960-0c7395e357cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGZsYW1lcyUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzYwNzk3NzY1fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Chef cooking with flames"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/70 via-[#121212]/50 to-[#121212]" />
        
        {/* Animated Floating Embers/Smoke Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
            animate={{
              y: [-100, -500],
              x: [0, Math.random() * 50 - 25],
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.5],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
        
        {/* Smoke/Steam Effect */}
        <motion.div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Letter-by-letter animation with smoke effect */}
          <div className="mb-4 smokeville-logo">
            {'SMOKEVILLE'.split('').map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: 'blur(0px)',
                }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  ease: 'easeOut'
                }}
                className="inline-block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#F5F5F5]"
              >
                {letter}
              </motion.span>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 text-[#CBA135] tracking-[0.15em] sm:tracking-[0.2em] uppercase"
          >
            GRILL-PIZZA-BEVES
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <LiquidButton
              onClick={() => onNavigate('menu')}
              variant="primary"
              size="lg"
              className="magnetic"
            >
              Explore Menu
            </LiquidButton>
            <MagneticButton
              onClick={() => onNavigate('bookings')}
              className="magnetic border-2 border-[#CBA135] text-[#CBA135] hover:bg-[#CBA135] hover:text-[#121212] transition-all px-8 py-4 rounded-full text-lg"
              strength={0.4}
            >
              Book a Table
            </MagneticButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex items-center justify-center gap-6 text-[#F5F5F5]"
          >
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#CBA135] fill-[#CBA135]" />
              <span>4.5 Star Rating</span>
            </div>
            <div className="h-4 w-px bg-[#CBA135]/30" />
            <span>1M+ Visitors</span>
          </motion.div>
        </div>
      </section>

      {/* About Preview */}
      <ScrollReveal>
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl mb-6 text-[#CBA135]">
              Our Story is Written in Flame
            </h2>
            <p className="text-lg text-[#F5F5F5]/80 mb-8 max-w-2xl mx-auto">
              At <span className="smokeville-logo">SMOKEVILLE</span>, we believe great food is born from fire, passion, and tradition. 
              Every dish tells a story of craftsmanship, from our wood-fired pizzas to our 
              slow-smoked ribs.
            </p>
            <MagneticButton
              onClick={() => onNavigate('about')}
              className="magnetic border-2 border-[#CBA135] text-[#CBA135] hover:bg-[#CBA135] hover:text-[#121212] transition-all px-6 py-3 rounded-full"
              strength={0.4}
            >
              Read Our Story
            </MagneticButton>
          </div>
        </section>
      </ScrollReveal>

      {/* Popular Dishes Carousel */}
      <ScrollReveal>
        <section className="py-20 px-4 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl mb-12 text-center text-[#CBA135]">
              Popular Dishes
            </h2>

          <div className="relative">
            <motion.div
              key={currentDish}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="aspect-[16/9] md:aspect-[21/9] relative rounded-2xl overflow-hidden"
            >
              <ImageWithFallback
                src={popularDishes[currentDish].image}
                alt={popularDishes[currentDish].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute bottom-0 left-0 right-0 p-8"
              >
                <h3 className="text-3xl md:text-4xl mb-2 text-[#F5F5F5]">
                  {popularDishes[currentDish].name}
                </h3>
                <p className="text-[#F5F5F5]/80 mb-4">
                  {popularDishes[currentDish].description}
                </p>
                <LiquidButton
                  onClick={() => onNavigate('menu')}
                  variant="primary"
                  size="md"
                  className="magnetic"
                >
                  Order Now
                </LiquidButton>
              </motion.div>
            </motion.div>

            {/* Navigation Arrows */}
            <button
              onClick={prevDish}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#CBA135]/20 hover:bg-[#CBA135]/40 backdrop-blur-sm rounded-full p-3 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-[#F5F5F5]" />
            </button>
            <button
              onClick={nextDish}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#CBA135]/20 hover:bg-[#CBA135]/40 backdrop-blur-sm rounded-full p-3 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-[#F5F5F5]" />
            </button>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {popularDishes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDish(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentDish ? 'w-8 bg-[#CBA135]' : 'w-2 bg-[#CBA135]/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        </section>
      </ScrollReveal>

      {/* Events Highlight */}
      <ScrollReveal>
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl mb-12 text-center text-[#CBA135]">
              Upcoming Events
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer"
                  onClick={() => onNavigate('events')}
                  whileHover={{ y: -8 }}
                >
                  <div className="aspect-[4/3] relative">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 p-6"
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                    >
                      <p className="text-[#CBA135] text-sm mb-1">{event.date}</p>
                      <h3 className="text-2xl text-[#F5F5F5]">{event.title}</h3>
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-[#CBA135]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Booking CTA */}
      <ScrollReveal>
        <section className="py-20 px-4">
          <div
            className="max-w-6xl mx-auto rounded-2xl overflow-hidden relative"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1698280954292-c955f882486f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwdGFibGUlMjBlbGVnYW50fGVufDF8fHx8MTc2MDcwMDQxMXww&ixlib=rb-4.1.0&q=80&w=1080)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="bg-[#121212]/80 backdrop-blur-sm py-20 px-8 text-center">
              <h2 className="text-4xl md:text-5xl mb-6 text-[#F5F5F5]">
                Reserve a Table Tonight
              </h2>
              <p className="text-[#F5F5F5]/80 mb-8 max-w-2xl mx-auto">
                Experience the finest dining in Cape Town. Book your table now and 
                let us take you on a culinary journey.
              </p>
              <Button
                onClick={() => onNavigate('bookings')}
                className="bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212] text-lg px-8 py-6 transition-all hover:shadow-[0_0_20px_rgba(255,136,0,0.4)] hover:-translate-y-1 active:scale-98"
              >
                Book Now
              </Button>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}

// Scroll Reveal Component
function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 60, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
