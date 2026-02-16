import { useState, useRef } from 'react';
import { Wine, Sparkles, GlassWater, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'sonner@2.0.3';

export function DrinksPage() {
  const [selectedWine, setSelectedWine] = useState<any>(null);
  const [hoveredBottle, setHoveredBottle] = useState<string | null>(null);
  const { addItem } = useCart();

  const handleAddToCart = (drink: any, isGlass: boolean = false) => {
    const price = isGlass && drink.glass ? drink.glass : drink.price;
    const itemName = isGlass ? `${drink.name} (Glass)` : drink.name;
    
    addItem({
      id: `${drink.name}-${isGlass ? 'glass' : 'bottle'}-${Date.now()}`,
      name: itemName,
      price,
      category: 'Drinks',
    });
    
    toast.success(`${itemName} added to cart!`, {
      description: `R${price}`,
      duration: 2000,
    });
  };

  const drinks = {
    redWines: [
      { name: 'Meerlust Cabernet Sauvignon', price: 700, type: 'Cabernet' },
      { name: 'Meerlust Merlot', price: 700, type: 'Merlot' },
      { name: 'Meerlust Rubicon', price: 900, type: 'Blend' },
      { name: 'Morgenster', price: 470, type: 'Blend' },
      { name: 'Rupert & Rothschild Classique', price: 400, glass: 85, type: 'Blend' },
      { name: 'Rupert & Rothschild Baron Edmond', price: 1600, type: 'Premium' },
      { name: 'Seriously Old Dirt', price: 500, type: 'Premium' },
      { name: 'The Work Of Time', price: 450, type: 'Premium' },
      { name: 'Rust en Vrede Cabernet Sauvignon', price: 800, type: 'Cabernet' },
      { name: 'Rust en Vrede Estate', price: 1000, type: 'Estate' },
      { name: 'Optima', price: 450, type: 'Blend' },
      { name: 'Chocolate Block', price: 450, type: 'Blend' },
      { name: 'Kanonkop Cape Blend', price: 250, type: 'Blend' },
      { name: 'Kanonkop Kadette', price: 300, type: 'Blend' },
      { name: 'Kanonkop Cabernet', price: 350, type: 'Cabernet' },
      { name: 'Kanonkop Estate Pinotage', price: 950, type: 'Pinotage' },
    ],
    whiteWines: [
      { name: 'Durbanville Rose', price: 180, glass: 60 },
      { name: 'Durbanville Sauvignon Blanc', price: 190, glass: 65 },
      { name: 'Boschendal', price: 300 },
      { name: 'Haute Cabriere', price: 200 },
      { name: 'Creation', price: 400 },
      { name: 'Spier', price: 190, glass: 65 },
      { name: 'Wild Yeast Springfield', price: 350 },
      { name: 'Hartenberg', price: 300 },
      { name: 'Babylonstoren', price: 600 },
      { name: 'Rupert & Rothschild Baron Nadine', price: 600 },
      { name: 'Cederberg Chenin Blanc', price: 230 },
      { name: 'Cederberg V Generation', price: 650 },
      { name: 'Boer Maak n Plaan', price: 540 },
      { name: 'The FMC', price: 1500 },
    ],
    bubbly: [
      { name: 'Boschendal Brut', price: 380 },
      { name: 'Boschendal Luxe Nectar', price: 380 },
      { name: 'Graham Beck Bliss Nectar', price: 380 },
      { name: 'Graham Beck Brut Rose', price: 380 },
      { name: 'Krone Brut', price: 380 },
      { name: 'Krone Night Nectar', price: 380 },
      { name: 'Pongraz Brut', price: 350 },
      { name: 'GH Mumm Brut', price: 1400, premium: true },
      { name: 'GH Mumm Demisec', price: 1800, premium: true },
      { name: 'Moët Chandon Brut', price: 1150, premium: true },
      { name: 'Moët Imperial Nectar', price: 1480, premium: true },
      { name: 'Moët Rose Imperial', price: 1680, premium: true },
      { name: 'Veuve Clicquot Brut', price: 1500, premium: true },
      { name: 'Veuve Rich', price: 1850, premium: true },
    ],
    liqueur: [
      { name: 'Jagermeister', price: 550 },
      { name: 'Amarula', price: 259 },
    ],
    tequila: [
      { name: 'Don Julio Reposado', price: 500, tot: 90 },
      { name: 'Jose Cuervo (Gold/Silver)', price: 500, tot: 39 },
      { name: 'Olmeca (Gold/Silver)', price: null, tot: 30 },
    ],
    shooters: [
      { name: 'Blowjob', price: 40 },
      { name: 'Blowjob With Teeth', price: 45 },
      { name: 'Blue Kamikaze', price: 40 },
      { name: 'Flaming Lamborghini', price: 90 },
      { name: 'Suitcase', price: 45 },
      { name: 'Springbok', price: 45 },
      { name: 'Liquid Cocaine', price: 50 },
      { name: 'Side Kick', price: 45 },
    ],
    bitters: [
      { name: 'Underberg', price: 45 },
    ],
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Bar Video Background */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-bar-with-liquor-bottles-and-lights-4019-large.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-[#121212]/70" />
        
        {/* Mist Effect */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30"
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: 'linear-gradient(to top, rgba(203, 161, 53, 0.3), transparent)',
          }}
        />
        
        <div className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl mb-4 text-[#F5F5F5] flex items-center justify-center gap-4"
          >
            <Wine className="w-16 h-16" />
            Drinks Menu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-[#CBA135]"
          >
            Premium Selection of Wines & Spirits
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs defaultValue="red" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-12 bg-[#1a1a1a] p-1 gap-2">
            {['Red Wine', 'White Wine', 'Bubbly', 'Liqueur', 'Tequila', 'Shooters', 'Bitters'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase().replace(' ', '-')}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#CBA135] data-[state=active]:to-[#B36A2E] data-[state=active]:text-[#121212]"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Red Wines */}
          <TabsContent value="red-wine">
            <WineSection
              title="RED WINES"
              wines={drinks.redWines}
              onSelect={setSelectedWine}
              onHover={setHoveredBottle}
              hoveredBottle={hoveredBottle}
              onAddToCart={handleAddToCart}
            />
          </TabsContent>

          {/* White Wines */}
          <TabsContent value="white-wine">
            <WineSection
              title="WHITE WINES"
              wines={drinks.whiteWines}
              onSelect={setSelectedWine}
              onHover={setHoveredBottle}
              hoveredBottle={hoveredBottle}
              color="white"
              onAddToCart={handleAddToCart}
            />
          </TabsContent>

          {/* Bubbly */}
          <TabsContent value="bubbly">
            <BubblySection
              wines={drinks.bubbly}
              onSelect={setSelectedWine}
              onHover={setHoveredBottle}
              hoveredBottle={hoveredBottle}
              onAddToCart={handleAddToCart}
            />
          </TabsContent>

          {/* Liqueur */}
          <TabsContent value="liqueur">
            <SpiritSection title="LIQUEUR" items={drinks.liqueur} onAddToCart={handleAddToCart} />
          </TabsContent>

          {/* Tequila */}
          <TabsContent value="tequila">
            <TequilaSection items={drinks.tequila} onAddToCart={handleAddToCart} />
          </TabsContent>

          {/* Shooters */}
          <TabsContent value="shooters">
            <ShooterSection items={drinks.shooters} onAddToCart={handleAddToCart} />
          </TabsContent>

          {/* Bitters */}
          <TabsContent value="bitters">
            <SpiritSection title="BITTERS" items={drinks.bitters} onAddToCart={handleAddToCart} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Wine Details Modal */}
      <AnimatePresence>
        {selectedWine && (
          <Dialog open={!!selectedWine} onOpenChange={() => setSelectedWine(null)}>
            <DialogContent className="bg-[#1a1a1a] border-[#CBA135]/30 text-[#F5F5F5]">
              <DialogHeader>
                <DialogTitle className="text-2xl text-[#CBA135] flex items-center gap-2">
                  <Wine className="w-6 h-6" />
                  {selectedWine.name}
                </DialogTitle>
              </DialogHeader>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Wine Pour Animation */}
                <div className="relative h-48 flex items-end justify-center">
                  <motion.div
                    className="absolute bottom-0 w-20 bg-gradient-to-t from-red-900 to-red-600 rounded-b-full"
                    initial={{ height: 0 }}
                    animate={{ height: '80%' }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                  />
                  <div className="relative z-10 text-7xl">🍷</div>
                </div>

                <div className="space-y-2">
                  {selectedWine.type && (
                    <p className="text-[#F5F5F5]/80">
                      <strong>Type:</strong> {selectedWine.type}
                    </p>
                  )}
                  <p className="text-2xl text-[#CBA135]">
                    Bottle: R{selectedWine.price}
                  </p>
                  {selectedWine.glass && (
                    <p className="text-xl text-[#CBA135]/80">
                      Glass: R{selectedWine.glass}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {selectedWine.glass && (
                    <Button 
                      onClick={() => handleAddToCart(selectedWine, true)}
                      className="flex-1 bg-gradient-to-r from-[#CBA135]/70 to-[#B36A2E]/70 hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Glass
                    </Button>
                  )}
                  <Button 
                    onClick={() => handleAddToCart(selectedWine, false)}
                    className="flex-1 bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Bottle
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}

function WineSection({ title, wines, onSelect, onHover, hoveredBottle, color = 'red', onAddToCart }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ x: color === 'white' ? 100 : -100, opacity: 0 }}
      animate={isInView ? { x: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      {/* Wine Pour Background Effect */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 opacity-10 pointer-events-none"
        animate={{
          scaleY: [0, 1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `radial-gradient(ellipse at top, ${color === 'red' ? 'rgba(139, 0, 0, 0.5)' : 'rgba(255, 215, 0, 0.5)'}, transparent)`,
        }}
      />

      <h2 className="text-4xl mb-8 text-[#CBA135]">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wines.map((wine: any, index: number) => (
          <motion.div
            key={index}
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            onMouseEnter={() => onHover(wine.name)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(wine)}
            className="bg-[#1a1a1a] rounded-xl p-6 hover:ring-2 hover:ring-[#CBA135] transition-all cursor-pointer group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-lg text-[#F5F5F5] group-hover:text-[#CBA135] transition-colors">
                  {wine.name}
                </h3>
                {wine.type && (
                  <Badge variant="outline" className="mt-1 border-[#CBA135]/30 text-[#CBA135]/80">
                    {wine.type}
                  </Badge>
                )}
              </div>
              <motion.div
                animate={hoveredBottle === wine.name ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="text-3xl"
              >
                🍷
              </motion.div>
            </div>
            
            <div className="mt-3 space-y-2">
              <div>
                <p className="text-[#CBA135] text-lg">R{wine.price}</p>
                {wine.glass && (
                  <p className="text-[#CBA135]/70 text-sm">R{wine.glass} / glass</p>
                )}
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(wine, false);
                }}
                size="sm"
                className="w-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add Bottle
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function BubblySection({ wines, onSelect, onHover, hoveredBottle, onAddToCart }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-4xl mb-8 text-[#CBA135] flex items-center gap-3">
        <Sparkles className="w-10 h-10" />
        BUBBLY
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wines.map((wine: any, index: number) => (
          <motion.div
            key={index}
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            onMouseEnter={() => onHover(wine.name)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(wine)}
            className={`bg-[#1a1a1a] rounded-xl p-6 hover:ring-2 hover:ring-[#CBA135] transition-all cursor-pointer group relative overflow-hidden ${
              wine.premium ? 'ring-1 ring-[#CBA135]/50' : ''
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {wine.premium && (
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
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255, 215, 0, 0.5) 50%, transparent 70%)',
                  backgroundSize: '200% 200%',
                }}
              />
            )}

            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-lg text-[#F5F5F5] group-hover:text-[#CBA135] transition-colors">
                  {wine.name}
                </h3>
                {wine.premium && (
                  <Badge className="mt-1 bg-[#CBA135] text-[#121212]">
                    Premium
                  </Badge>
                )}
              </div>
              <motion.div
                animate={hoveredBottle === wine.name ? { y: [-2, 2, -2] } : {}}
                transition={{ duration: 0.3, repeat: Infinity }}
                className="text-3xl"
              >
                🍾
              </motion.div>
            </div>
            
            <div className="mt-3 space-y-2">
              <p className="text-[#CBA135] text-lg">R{wine.price}</p>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(wine, false);
                }}
                size="sm"
                className="w-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function SpiritSection({ title, items, onAddToCart }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-4xl mb-8 text-[#CBA135]">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item: any, index: number) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-[#1a1a1a] rounded-xl p-8 text-center"
            whileHover={{ rotate: 5, scale: 1.1 }}
          >
            <div className="text-6xl mb-4">🥃</div>
            <h3 className="text-xl text-[#F5F5F5] mb-2">{item.name}</h3>
            <p className="text-2xl text-[#CBA135] mb-3">R{item.price}</p>
            <Button
              onClick={() => onAddToCart(item, false)}
              size="sm"
              className="w-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function TequilaSection({ items, onAddToCart }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-4xl mb-8 text-[#CBA135]">TEQUILA</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item: any, index: number) => (
          <motion.div
            key={index}
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-[#1a1a1a] rounded-xl p-6"
            whileHover={{ y: -10 }}
          >
            <div className="text-5xl mb-4 text-center">🌵</div>
            <h3 className="text-xl text-[#F5F5F5] mb-2">{item.name}</h3>
            <div className="space-y-2 mb-3">
              {item.price && <p className="text-[#CBA135]">Bottle: R{item.price}</p>}
              {item.tot && <p className="text-[#CBA135]/80">Single Tot: R{item.tot}</p>}
            </div>
            <Button
              onClick={() => onAddToCart(item, false)}
              size="sm"
              className="w-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ShooterSection({ items, onAddToCart }: any) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-4xl mb-8 text-[#CBA135]">SHOOTERS</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item: any, index: number) => (
          <motion.div
            key={index}
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="bg-[#1a1a1a] rounded-xl p-4 text-center hover:bg-[#CBA135]/10 transition-all"
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          >
            <div className="text-3xl mb-2">🥃</div>
            <h4 className="text-sm text-[#F5F5F5] mb-1">{item.name}</h4>
            <p className="text-[#CBA135] mb-2">R{item.price}</p>
            <Button
              onClick={() => onAddToCart(item, false)}
              size="sm"
              className="w-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212] text-xs py-1"
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Add
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
