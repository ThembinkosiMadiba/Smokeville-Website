import { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Star,
  Plus,
  Minus,
  ShoppingCart
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LiquidButton } from './LiquidButton';
import { MorphButton } from './MorphButton';

export interface FoodItem {
  name: string;
  description: string;
  price: number;
  image?: string;
  rating?: number;
  reviews?: number;
  tags?: string[];
  allergens?: string[];
  prepTime?: number;
}

interface FoodDetailModalProps {
  item: FoodItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: FoodItem, quantity: number) => void;
}

export function FoodDetailModal({ item, isOpen, onClose, onAddToCart }: FoodDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800 p-0">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Image */}
          <div className="relative aspect-video w-full overflow-hidden">
            <ImageWithFallback
              src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

            {/* Rating Badge */}
            {item.rating && (
              <div className="absolute bottom-4 left-4">
                <Badge className="bg-[#CBA135] text-black border-none flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  {item.rating} {item.reviews && `(${item.reviews})`}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Header */}
            <div>
              <DialogTitle className="text-2xl mb-2">{item.name}</DialogTitle>
              <p className="text-zinc-400">{item.description}</p>
              
              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="border-zinc-700 text-zinc-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Allergens */}
            {item.allergens && item.allergens.length > 0 && (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-400">
                  <strong>Allergens:</strong> {item.allergens.join(', ')}
                </p>
              </div>
            )}

            {/* Prep Time */}
            {item.prepTime && (
              <div className="text-sm text-zinc-400">
                Prep time: ~{item.prepTime} minutes
              </div>
            )}

            {/* Price and Quantity */}
            <div className="pt-4 border-t border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl text-[#CBA135]">R{item.price}</span>
                
                {/* Quantity Selector */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <span className="w-8 text-center">{quantity}</span>
                  
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total Price */}
              {quantity > 1 && (
                <div className="text-sm text-zinc-400">
                  Total: <span className="text-[#CBA135]">R{item.price * quantity}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <LiquidButton
                  variant="secondary"
                  onClick={onClose}
                  className="w-full"
                >
                  Close
                </LiquidButton>

                <MorphButton
                  onClick={async () => {
                    onAddToCart(item, quantity);
                    await new Promise(resolve => setTimeout(resolve, 500));
                  }}
                  className="w-full bg-[#CBA135] hover:bg-[#B8962F] text-black rounded-full px-6 py-3"
                  successText="Added!"
                  loadingText="Adding..."
                  icon={<ShoppingCart className="w-4 h-4" />}
                >
                  Add to Cart
                </MorphButton>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
