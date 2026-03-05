import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, X, ShoppingCart, Check, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner@2.0.3';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: MenuItem[];
  autoOrder?: boolean;
}

interface MenuItem {
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  quantity?: number;
}

interface AIFoodAssistantProps {
  onNavigate?: (page: string) => void;
}

// Menu database
const menuDatabase = {
  burgers: [
    { name: 'Smokehouse Burger', price: 95, category: 'burger', description: 'Premium beef with house sauce', image: 'https://images.unsplash.com/photo-1554306297-0c86e837d24b?w=400' },
    { name: 'BBQ Bacon Burger', price: 105, category: 'burger', description: 'Double patty with bacon', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
    { name: 'Chicken Burger', price: 85, category: 'burger', description: 'Grilled chicken breast', image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400' },
  ],
  chicken: [
    { name: 'Smoked Full Chicken', price: 190, category: 'chicken', description: 'Slow-smoked perfection', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400' },
    { name: 'Chicken Wings (6pc)', price: 65, category: 'chicken', description: 'Crispy wings with sauce', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400' },
    { name: 'Grilled Chicken Breast', price: 120, category: 'chicken', description: 'Tender and juicy', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400' },
  ],
  pizza: [
    { name: 'Margherita Pizza', price: 85, category: 'pizza', description: 'Classic tomato and mozzarella', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
    { name: 'Pepperoni Pizza', price: 95, category: 'pizza', description: 'Loaded with pepperoni', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
    { name: 'BBQ Chicken Pizza', price: 105, category: 'pizza', description: 'BBQ sauce, chicken, onions', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
  ],
  ribs: [
    { name: 'Pork Ribs (500g)', price: 180, category: 'ribs', description: 'Fall-off-the-bone tender', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400' },
    { name: 'Beef Short Ribs', price: 200, category: 'ribs', description: 'Premium beef ribs', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400' },
  ],
  drinks: [
    { name: 'Mojito', price: 45, category: 'cocktail', description: 'Fresh mint and lime', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400' },
    { name: 'Pineapple Mojito', price: 50, category: 'cocktail', description: 'Tropical twist', image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400' },
    { name: 'Strawberry Daiquiri', price: 48, category: 'cocktail', description: 'Sweet and fruity', image: 'https://images.unsplash.com/photo-1609951651556-5334e2706168?w=400' },
    { name: 'Red Wine', price: 40, category: 'wine', description: 'House red', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400' },
    { name: 'Draft Beer', price: 35, category: 'beer', description: 'Cold and refreshing', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400' },
  ],
  desserts: [
    { name: 'Chocolate Lava Cake', price: 55, category: 'dessert', description: 'Warm chocolate heaven', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400' },
    { name: 'Ice Cream Sundae', price: 45, category: 'dessert', description: 'Three scoops with toppings', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400' },
    { name: 'Cheesecake', price: 50, category: 'dessert', description: 'Creamy New York style', image: 'https://images.unsplash.com/photo-1533134242318-1f45e5f0e8b4?w=400' },
  ],
};

export function AIFoodAssistant({ onNavigate }: AIFoodAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your AI food assistant.\n\nI can help you:\n• Find the perfect dish for your mood\n• Plan orders for groups\n• Suggest drink pairings\n• Place orders directly\n\nTry asking me something like "I want 3 burgers and 2 mojitos" or "We\'re 8 people, what should we eat?"',
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseQuery = (query: string): Message => {
    const lowerQuery = query.toLowerCase();
    
    // Intent detection
    const isGroupOrder = /(\d+)\s*(people|person|pax)/i.test(query);
    const isOrderCommand = /order|get|want|give|add/i.test(query);
    const isDrinkRequest = /drink|cocktail|beer|wine|mojito|beverage/i.test(query);
    const isSweetCraving = /sweet|dessert|cake|chocolate|ice cream/i.test(query);
    const isHungry = /hungry|starving|feast/i.test(query);
    
    let suggestions: MenuItem[] = [];
    let responseText = '';
    let autoOrder = false;

    // Extract quantities from order commands
    const quantityMatches = query.match(/(\d+)\s*(burger|pizza|mojito|wing|rib|beer|wine|chicken)/gi);
    
    if (quantityMatches && isOrderCommand) {
      // Auto-order mode
      autoOrder = true;
      const orderedItems: MenuItem[] = [];
      
      quantityMatches.forEach(match => {
        const [, quantity, item] = match.match(/(\d+)\s*(.+)/i) || [];
        const qty = parseInt(quantity);
        
        // Find matching items in database
        Object.values(menuDatabase).flat().forEach(menuItem => {
          if (menuItem.name.toLowerCase().includes(item.toLowerCase()) || 
              menuItem.category.toLowerCase().includes(item.toLowerCase())) {
            orderedItems.push({ ...menuItem, quantity: qty });
          }
        });
      });
      
      if (orderedItems.length > 0) {
        suggestions = orderedItems;
        const total = orderedItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        responseText = `Great! I found these items for your order (Total: R${total}):\n\nWould you like me to add them to your cart?`;
      } else {
        responseText = 'I couldn\'t find those exact items. Here are some suggestions:';
        suggestions = Object.values(menuDatabase).flat().slice(0, 3);
      }
    }
    else if (isDrinkRequest) {
      // Drink-specific search
      if (lowerQuery.includes('pineapple')) {
        suggestions = menuDatabase.drinks.filter(d => d.name.toLowerCase().includes('pineapple'));
      } else if (lowerQuery.includes('mojito')) {
        suggestions = menuDatabase.drinks.filter(d => d.name.toLowerCase().includes('mojito'));
      } else {
        suggestions = menuDatabase.drinks.slice(0, 4);
      }
      responseText = `Here are some drink options for you:`;
    }
    else if (isSweetCraving) {
      suggestions = menuDatabase.desserts;
      responseText = `Perfect! Here are our sweet treats:`;
    }
    else if (isGroupOrder) {
      const groupSize = parseInt(query.match(/(\d+)/)?.[1] || '4');
      
      if (groupSize >= 8) {
        responseText = `For ${groupSize} people, I recommend our platters! Here are some main items:`;
        suggestions = [
          ...menuDatabase.ribs,
          ...menuDatabase.chicken.slice(0, 1),
          ...menuDatabase.pizza.slice(0, 2),
        ];
      } else if (groupSize >= 4) {
        responseText = `For ${groupSize} people, here's a great selection:`;
        suggestions = [
          ...menuDatabase.pizza.slice(0, 2),
          ...menuDatabase.chicken.slice(0, 1),
          ...menuDatabase.drinks.slice(0, 2),
        ];
      } else {
        responseText = `For ${groupSize} people, here are some options:`;
        suggestions = [
          ...menuDatabase.burgers.slice(0, 2),
          ...menuDatabase.pizza.slice(0, 1),
          ...menuDatabase.drinks.slice(0, 2),
        ];
      }
    }
    else if (lowerQuery.includes('burger')) {
      suggestions = menuDatabase.burgers;
      responseText = `Here are our burgers:`;
    }
    else if (lowerQuery.includes('pizza')) {
      suggestions = menuDatabase.pizza;
      responseText = `Check out our pizzas:`;
    }
    else if (lowerQuery.includes('chicken')) {
      suggestions = menuDatabase.chicken;
      responseText = `Our chicken options:`;
    }
    else if (lowerQuery.includes('rib')) {
      suggestions = menuDatabase.ribs;
      responseText = `Our ribs are amazing:`;
    }
    else if (isHungry) {
      responseText = `You must be starving! Here are our most popular items:`;
      suggestions = [
        menuDatabase.chicken[0],
        menuDatabase.ribs[0],
        menuDatabase.burgers[0],
        menuDatabase.pizza[1],
      ];
    }
    else {
      // Default suggestions
      responseText = `Here are some popular items you might like:`;
      suggestions = [
        menuDatabase.burgers[0],
        menuDatabase.pizza[0],
        menuDatabase.chicken[0],
        menuDatabase.drinks[0],
      ];
    }

    return {
      role: 'assistant',
      content: responseText,
      suggestions,
      autoOrder,
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = parseQuery(input);
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 800);
  };

  const handleAddToCart = (item: MenuItem, quantity: number = 1) => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${item.name}-${Date.now()}-${i}`,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
      });
    }
    
    toast.success(`Added ${quantity}x ${item.name} to cart!`, {
      description: `R${item.price * quantity}`,
      duration: 2000,
    });
  };

  const handleQuickOrder = (suggestions: MenuItem[]) => {
    suggestions.forEach(item => {
      handleAddToCart(item, item.quantity || 1);
    });
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '✓ All items added to your cart! You can view your cart or continue ordering.',
    }]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Chat Container */}
      <div className="bg-[#1a1a1a]/90 backdrop-blur-xl rounded-3xl border border-[#CBA135]/30 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#CBA135] to-[#B36A2E] p-4 flex items-center gap-3 relative overflow-hidden">
          {/* Animated background pattern */}
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
            }}
          />
          
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="bg-white/20 p-2 rounded-full relative z-10"
          >
            <Sparkles className="w-5 h-5 text-white" />
          </motion.div>
          <div className="relative z-10">
            <h3 className="text-white font-semibold">AI Food Assistant</h3>
            <p className="text-white/80 text-xs">Powered by natural language understanding</p>
          </div>
          
          {/* Pulse effect */}
          <motion.div
            className="absolute right-4 top-1/2 -translate-y-1/2"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full" />
          </motion.div>
        </div>

        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#CBA135]/30 scrollbar-track-transparent">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-[#CBA135] text-black'
                        : 'bg-zinc-800 text-white'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-3 space-y-2"
                    >
                      {message.autoOrder && (
                        <Button
                          onClick={() => handleQuickOrder(message.suggestions!)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white mb-3"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add All to Cart
                        </Button>
                      )}

                      <div className="grid gap-2">
                        {message.suggestions.map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-zinc-900 rounded-xl p-3 border border-zinc-700 hover:border-[#CBA135] transition-all"
                          >
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <ImageWithFallback
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <h4 className="text-white font-medium text-sm">
                                      {item.name}
                                      {item.quantity && item.quantity > 1 && (
                                        <Badge className="ml-2 bg-[#CBA135] text-black">
                                          x{item.quantity}
                                        </Badge>
                                      )}
                                    </h4>
                                    {item.description && (
                                      <p className="text-zinc-400 text-xs mt-0.5">{item.description}</p>
                                    )}
                                  </div>
                                  <span className="text-[#CBA135] font-semibold text-sm whitespace-nowrap">
                                    R{item.price * (item.quantity || 1)}
                                  </span>
                                </div>
                                <Button
                                  onClick={() => handleAddToCart(item, item.quantity || 1)}
                                  size="sm"
                                  className="mt-2 bg-[#CBA135] hover:bg-[#B36A2E] text-black text-xs"
                                >
                                  <ShoppingCart className="w-3 h-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}

            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-zinc-800 rounded-2xl p-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#CBA135]" />
                  <span className="text-white text-sm">Thinking...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-zinc-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Try: 'I want 3 burgers and 2 mojitos' or 'Something sweet'"
              className="flex-1 bg-zinc-800 text-white rounded-full px-6 py-3 border border-zinc-700 focus:border-[#CBA135] focus:outline-none placeholder:text-zinc-500"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="rounded-full bg-[#CBA135] hover:bg-[#B36A2E] text-black px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick suggestions */}
          <div className="mt-3">
            <p className="text-xs text-zinc-500 mb-2">Try these:</p>
            <div className="flex flex-wrap gap-2">
              {[
                'I feel like something sweet',
                'We\'re 8 people, what should we order?',
                'Order me 3 burgers and 2 mojitos',
                'Pineapple cocktail',
                'I\'m starving',
                'Show me desserts'
              ].map((suggestion) => (
                <motion.button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-300 hover:bg-[#CBA135]/20 hover:text-[#CBA135] hover:border-[#CBA135] transition-colors border border-zinc-700"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
