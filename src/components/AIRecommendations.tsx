import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, ShoppingCart, Zap, Star, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { HolographicCard } from './HolographicCard';
import { NeonGlow, NeonText } from './NeonGlow';
import {
  getPersonalizedRecommendations,
  getTrendingItems,
  getComplementaryItems,
  getSimilarItems,
  getTimeBasedRecommendations,
  type Recommendation
} from '../services/recommendationService';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner@2.0.3';

interface AIRecommendationsProps {
  mode?: 'personalized' | 'trending' | 'complementary' | 'similar' | 'time-based';
  itemName?: string;
  limit?: number;
  onNavigate?: (page: string) => void;
}

export function AIRecommendations({ 
  mode = 'personalized', 
  itemName,
  limit = 6,
  onNavigate
}: AIRecommendationsProps) {
  const { currentUser } = useAuth();
  const { addItem } = useCart();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, [mode, itemName, currentUser]);

  const loadRecommendations = async () => {
    setLoading(true);
    
    try {
      let results: Recommendation[] = [];

      switch (mode) {
        case 'personalized':
          if (currentUser) {
            results = await getPersonalizedRecommendations(currentUser.uid, limit);
          } else {
            results = await getTrendingItems(limit);
          }
          break;
        
        case 'trending':
          results = await getTrendingItems(limit);
          break;
        
        case 'complementary':
          if (itemName) {
            results = getComplementaryItems(itemName, limit);
          }
          break;
        
        case 'similar':
          if (itemName) {
            results = getSimilarItems(itemName, limit);
          }
          break;
        
        case 'time-based':
          results = getTimeBasedRecommendations();
          break;
      }

      setRecommendations(results);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: Recommendation) => {
    addItem({
      id: `${item.name}-${Date.now()}`,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });
    
    toast.success(`${item.name} added to cart!`, {
      description: `R${item.price}`,
      duration: 2000,
    });
  };

  const getTitle = () => {
    switch (mode) {
      case 'personalized':
        return currentUser ? 'Recommended For You' : 'Popular Choices';
      case 'trending':
        return 'Trending Now';
      case 'complementary':
        return 'Pairs Well With';
      case 'similar':
        return 'Similar Items';
      case 'time-based':
        return 'Special Offers';
      default:
        return 'Recommendations';
    }
  };

  const getIcon = () => {
    switch (mode) {
      case 'personalized':
        return <Sparkles className="w-5 h-5" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5" />;
      case 'complementary':
      case 'similar':
        return <Zap className="w-5 h-5" />;
      case 'time-based':
        return <Star className="w-5 h-5 fill-current" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-5 h-5 text-[#CBA135]" />
          </motion.div>
          <h2>{getTitle()}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-zinc-900 border-zinc-800 h-80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <NeonGlow intensity="low" className="p-2 rounded-lg">
            <div className="text-[#CBA135]">
              {getIcon()}
            </div>
          </NeonGlow>
          <div>
            <h2 className="flex items-center gap-2">
              {getTitle()}
              {mode === 'personalized' && currentUser && (
                <Badge className="bg-[#CBA135]/20 text-[#CBA135] border-[#CBA135]/30">
                  AI Powered
                </Badge>
              )}
            </h2>
            {mode === 'personalized' && currentUser && (
              <p className="text-sm text-zinc-400 mt-1">
                Based on your taste preferences and order history
              </p>
            )}
          </div>
        </motion.div>

        {onNavigate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('menu')}
            className="text-[#CBA135] hover:text-[#B8962F]"
          >
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((item, index) => (
          <motion.div
            key={`${item.name}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            <HolographicCard intensity={hoveredIndex === index ? 1.2 : 0.5}>
              <Card className="bg-zinc-900 border-zinc-800 overflow-hidden h-full group">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {item.image && (
                    <motion.div
                      className="w-full h-full"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
                  
                  {/* Score Badge */}
                  {item.score >= 80 && (
                    <motion.div
                      className="absolute top-3 right-3"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                    >
                      <NeonGlow intensity="medium" pulse>
                        <Badge className="bg-[#CBA135] text-black border-none">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          {item.score >= 90 ? 'Top Pick' : 'Recommended'}
                        </Badge>
                      </NeonGlow>
                    </motion.div>
                  )}

                  {/* Tags */}
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                    {item.tags.slice(0, 2).map((tag, tagIndex) => (
                      <motion.div
                        key={tagIndex}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 + tagIndex * 0.1 }}
                      >
                        <Badge className="bg-black/60 backdrop-blur-sm text-white border-zinc-700 text-xs">
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Reason */}
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#CBA135] mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-[#CBA135]">{item.reason}</p>
                  </div>

                  {/* Name */}
                  <div>
                    <h3 className="mb-1 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-zinc-400">{item.category}</p>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                    <div>
                      <NeonText className="text-xl">
                        R{item.price}
                      </NeonText>
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        className="bg-[#CBA135] hover:bg-[#B8962F] text-black"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    opacity: hoveredIndex === index ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: 'radial-gradient(circle at center, #CBA135, transparent 70%)',
                  }}
                />
              </Card>
            </HolographicCard>
          </motion.div>
        ))}
      </div>

      {/* AI Insight */}
      {mode === 'personalized' && currentUser && recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-[#CBA135]/10 to-purple-500/10 border-[#CBA135]/30">
            <div className="p-4 flex items-start gap-3">
              <div className="p-2 rounded-full bg-[#CBA135]/20">
                <Sparkles className="w-5 h-5 text-[#CBA135]" />
              </div>
              <div className="flex-1">
                <h4 className="text-[#CBA135] mb-1">AI Insight</h4>
                <p className="text-sm text-zinc-300">
                  These recommendations are personalized based on your order history, preferences, and what other customers with similar tastes enjoy. Try something new or stick with your favorites!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
