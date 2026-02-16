import { useRef } from 'react';
import { Clock, Calendar, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { motion, useInView } from 'motion/react';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'sonner@2.0.3';

export function MogoduMondayPage() {
  const { addItem } = useCart();

  const handleAddToCart = (dish: any) => {
    addItem({
      id: `${dish.name}-${Date.now()}`,
      name: dish.name,
      price: dish.price,
      category: 'Mogodu Monday',
    });
    
    toast.success(`${dish.name} added to cart!`, {
      description: `R${dish.price}`,
      duration: 2000,
    });
  };

  const dishes = {
    meats: [
      { name: 'Mogodu', price: 90 },
      { name: 'Mleqwa (Hard Body)', price: 90 },
      { name: 'Beef Trotters', price: 50 },
      { name: 'Pork Trotters', price: 50 },
      { name: 'Chicken Feet', price: 25 },
      { name: 'Chicken Hearts and Gizzard', price: 25 },
    ],
    combos: [
      { 
        name: 'Traditional Mix', 
        price: 100, 
        desc: '2x meat, 2x veggies, 1x starch',
        featured: false 
      },
      { 
        name: '2 Course Meal', 
        price: 140, 
        desc: '2x meat, 2x veggies, 1x starch, plus heart gizzards, garlic roll starter',
        featured: true 
      },
    ],
    veggies: [
      { name: 'Cabbage', price: 10 },
      { name: 'Butternut', price: 10 },
      { name: 'Chakalaka', price: 15 },
      { name: 'Atchaar', price: 15 },
    ],
    starch: [
      { name: 'Pap', price: 20 },
      { name: 'Dumpling', price: 20 },
      { name: 'Samp', price: 20 },
      { name: 'Toasted Garlic Bread', price: 5 },
    ],
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Bubbling Pot Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-boiling-water-in-a-pot-4402-large.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/80 via-orange-900/70 to-[#121212]" />
        
        {/* Steam Effect */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            y: [0, -50, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: 'radial-gradient(circle at 50% 100%, rgba(255, 255, 255, 0.5) 0%, transparent 60%)',
          }}
        />
        
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: 'spring' }}
            className="mb-6"
          >
            <motion.h1
              className="text-6xl md:text-8xl mb-4 text-[#CBA135]"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
              animate={{ 
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              Mogodu Monday
            </motion.h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-3xl text-amber-200 mb-6"
          >
            Traditional African Cuisine
          </motion.p>

          {/* Availability Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
            className="inline-flex items-center gap-3 bg-[#1a1a1a]/80 backdrop-blur-sm rounded-full px-6 py-3 border-2 border-[#CBA135]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
              <Clock className="w-6 h-6 text-[#CBA135]" />
            </motion.div>
            <span className="text-[#F5F5F5]">Available Mondays 13:00 – Close</span>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Featured Combos */}
        <Section title="Featured Meals" icon="⭐">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {dishes.combos.map((combo, index) => (
              <ComboCard key={index} combo={combo} index={index} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </Section>

        {/* Meats Section */}
        <Section title="Meats" icon="🍖">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {dishes.meats.map((dish, index) => (
              <DishCard key={index} dish={dish} index={index} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </Section>

        {/* Grid Layout for Veggies & Starch */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Section title="Veggies" icon="🥬">
            <div className="grid grid-cols-2 gap-4">
              {dishes.veggies.map((dish, index) => (
                <DishCard key={index} dish={dish} index={index} type="veggie" onAddToCart={handleAddToCart} />
              ))}
            </div>
          </Section>

          <Section title="Starch" icon="🍚">
            <div className="grid grid-cols-2 gap-4">
              {dishes.starch.map((dish, index) => (
                <DishCard key={index} dish={dish} index={index} type="starch" onAddToCart={handleAddToCart} />
              ))}
            </div>
          </Section>
        </div>

        {/* Cultural Note */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-2xl p-8 border border-[#CBA135]/30"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">🏺</div>
            <h3 className="text-3xl mb-4 text-[#CBA135]">A Taste of Tradition</h3>
            <p className="text-[#F5F5F5]/80 text-lg max-w-3xl mx-auto">
              Experience authentic South African traditional cuisine every Monday. 
              Our Mogodu Monday special celebrates the rich culinary heritage of our culture, 
              prepared with love and served with pride.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="mb-12"
    >
      <motion.h2
        className="text-4xl mb-8 text-amber-600 flex items-center gap-3"
        initial={{ x: -50, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="text-5xl">{icon}</span>
        {title}
      </motion.h2>
      {children}
    </motion.section>
  );
}

function ComboCard({ combo, index, onAddToCart }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
      animate={isInView ? { scale: 1, opacity: 1, rotateY: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className={`relative bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-2xl p-8 border-2 overflow-hidden group ${
        combo.featured ? 'border-[#CBA135]' : 'border-[#CBA135]/30'
      }`}
      whileHover={{ scale: 1.05, y: -10 }}
    >
      {combo.featured && (
        <motion.div
          className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(203, 161, 53, 0.8) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
          }}
        />
      )}

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl md:text-3xl text-[#F5F5F5] mb-2">{combo.name}</h3>
            {combo.featured && (
              <Badge className="bg-[#CBA135] text-[#121212]">
                Premium Choice
              </Badge>
            )}
          </div>
          <span className="text-3xl text-[#CBA135]">R{combo.price}</span>
        </div>
        
        <p className="text-[#F5F5F5]/80 mb-6">{combo.desc}</p>
        
        <Button 
          onClick={() => onAddToCart(combo)}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-[#121212] transition-all hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}

function DishCard({ dish, index, type = 'meat', onAddToCart }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const icons: any = {
    meat: '🥘',
    veggie: '🥬',
    starch: '🍚',
  };

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ 
        scale: 1.1, 
        rotate: [0, -2, 2, 0],
        boxShadow: '0 10px 30px rgba(251, 191, 36, 0.3)'
      }}
      className="bg-[#1a1a1a] rounded-xl p-4 text-center border border-[#CBA135]/20 hover:border-[#CBA135] transition-all"
    >
      <motion.div
        className="text-4xl mb-2"
        animate={{ 
          y: [0, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: index * 0.1,
        }}
      >
        {icons[type]}
      </motion.div>
      <h4 className="text-[#F5F5F5] mb-1 text-sm md:text-base">{dish.name}</h4>
      <p className="text-amber-500 mb-2">R{dish.price}</p>
      <Button
        onClick={() => onAddToCart(dish)}
        size="sm"
        className="w-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212] text-xs py-1"
      >
        <ShoppingCart className="w-3 h-3 mr-1" />
        Add
      </Button>
    </motion.div>
  );
}
