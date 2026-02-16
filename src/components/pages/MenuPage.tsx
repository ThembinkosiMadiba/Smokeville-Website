import { useState } from 'react';
import { Flame, ShoppingCart, Plus, Check, Star, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { motion, useInView } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useRef } from 'react';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'sonner@2.0.3';
import { FoodDetailModal, type FoodItem } from '../FoodDetailModal';
import { LiquidButton } from '../LiquidButton';
import { MagneticButton } from '../MagneticButton';

interface MenuPageProps {
  onNavigate: (page: string) => void;
}

interface MenuItem {
  name: string;
  desc?: string;
  price: number;
  smoked?: boolean;
  image?: string;
  category?: string;
  serves?: string;
  featured?: boolean;
  mealPrice?: number;
  rating?: number;
}

export function MenuPage({ onNavigate }: MenuPageProps) {
  const [selectedMeals, setSelectedMeals] = useState<{ [key: string]: boolean }>({});
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const { addItem } = useCart();

  const toggleMeal = (itemName: string) => {
    setSelectedMeals(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const handleAddToCart = (item: MenuItem, isMeal: boolean = false) => {
    const price = isMeal && item.mealPrice ? item.mealPrice : item.price;
    const itemName = isMeal ? `${item.name} (Meal)` : item.name;
    
    addItem({
      id: `${item.name}-${isMeal ? 'meal' : 'regular'}-${Date.now()}`,
      name: itemName,
      price,
      image: item.image,
      category: item.category,
      isMeal,
    });
    
    toast.success(`${itemName} added to cart!`, {
      description: `R${price}`,
      duration: 2000,
    });
  };

  // Convert MenuItem to detailed food item
  const createDetailedItem = (item: MenuItem): FoodItem => {
    return {
      name: item.name,
      description: item.desc || 'Delicious food prepared with care',
      price: item.price,
      image: item.image,
      allergens: ['Gluten', 'Dairy'],
      prepTime: 15,
      rating: item.rating || 4.5,
      reviews: 127,
      tags: item.smoked ? ['Smoked', 'Signature', 'Popular'] : ['Grilled', 'Fresh'],
    };
  };

  const handleViewDetails = (item: MenuItem) => {
    setSelectedItem(createDetailedItem(item));
  };

  const menuData = {
    poultry: [
      {
        category: 'Singles',
        items: [
          { 
            name: 'Smoked Full Chicken', 
            desc: 'Cut into 8 to 10 pieces', 
            price: 190, 
            smoked: true,
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1709392975965-00889c6aa545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMHNtb2tlZHxlbnwxfHx8fDE3NjA3OTU3MzN8MA&ixlib=rb-4.1.0&q=80&w=1080'
          },
          { 
            name: 'Smoked Half Chicken', 
            desc: 'Cut into 6 pieces', 
            price: 100, 
            smoked: true,
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1709392975965-00889c6aa545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMHNtb2tlZHxlbnwxfHx8fDE3NjA3OTU3MzN8MA&ixlib=rb-4.1.0&q=80&w=1080'
          },
          { 
            name: 'Smoked Quarter Chicken', 
            desc: 'Cut into 3 pieces', 
            price: 65, 
            smoked: true,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1709392975965-00889c6aa545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMHNtb2tlZHxlbnwxfHx8fDE3NjA3OTU3MzN8MA&ixlib=rb-4.1.0&q=80&w=1080'
          },
        ]
      },
      {
        category: 'Basted or Non-Basted Winglets',
        items: [
          { 
            name: '8 Smoked Wings', 
            desc: 'Tender and juicy', 
            price: 95, 
            smoked: true,
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1592011432621-f7f576f44484?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwd2luZ3MlMjBncmlsbGVkfGVufDF8fHx8MTc2MDc5NTczNHww&ixlib=rb-4.1.0&q=80&w=1080'
          },
          { 
            name: '12 Smoked Wings', 
            desc: 'Perfect for sharing', 
            price: 115, 
            smoked: true,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1592011432621-f7f576f44484?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwd2luZ3MlMjBncmlsbGVkfGVufDF8fHx8MTc2MDc5NTczNHww&ixlib=rb-4.1.0&q=80&w=1080'
          },
          { 
            name: '16 Smoked Wings', 
            desc: 'For the wing lover', 
            price: 150, 
            smoked: true,
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1592011432621-f7f576f44484?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwd2luZ3MlMjBncmlsbGVkfGVufDF8fHx8MTc2MDc5NTczNHww&ixlib=rb-4.1.0&q=80&w=1080'
          },
        ]
      }
    ],
    pork: [
      { 
        name: 'Smoked Full Rack Ribs', 
        desc: 'Basted with BBQ Sauce or Non Basted', 
        price: 190, 
        smoked: true,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1606157715813-aceb0ffb810e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYnElMjByaWJzJTIwcG9ya3xlbnwxfHx8fDE3NjA3OTU3MzN8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      { 
        name: 'Smoked Half Rack Ribs', 
        desc: 'Basted with BBQ Sauce or Non Basted', 
        price: 96, 
        smoked: true,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1606157715813-aceb0ffb810e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYnElMjByaWJzJTIwcG9ya3xlbnwxfHx8fDE3NjA3OTU3MzN8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      { 
        name: 'Smoked Eisbein', 
        desc: 'Chopped, Brazed with chilli sauce (optional)', 
        price: 160, 
        smoked: true,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1606157715813-aceb0ffb810e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYnElMjByaWJzJTIwcG9ya3xlbnwxfHx8fDE3NjA3OTU3MzN8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      { 
        name: 'Smoked Pork Neck', 
        desc: 'Served with chips or salad', 
        price: 130, 
        smoked: true,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1606157715813-aceb0ffb810e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYnElMjByaWJzJTIwcG9ya3xlbnwxfHx8fDE3NjA3OTU3MzN8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
    ],
    mains: [
      { 
        name: 'Smoked Full Chicken', 
        desc: 'With 3 Sides of your Choice', 
        price: 280, 
        smoked: true,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1709392975965-00889c6aa545?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMHNtb2tlZHxlbnwxfHx8fDE3NjA3OTU3MzN8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      { 
        name: 'Smoked Full Rack Rib', 
        desc: 'With 3 sides of your Choice', 
        price: 250, 
        smoked: true,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1606157715813-aceb0ffb810e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYnElMjByaWJzJTIwcG9ya3xlbnwxfHx8fDE3NjA3OTU3MzN8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      { 
        name: 'Smoked Eisbein', 
        desc: 'With 3 Sides of your Choice', 
        price: 250, 
        smoked: false,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1606157715813-aceb0ffb810e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYnElMjByaWJzJTIwcG9ya3xlbnwxfHx8fDE3NjA3OTU3MzN8MA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      { 
        name: 'Snoek Fish', 
        desc: 'With 3 sides of your Choice', 
        price: 240, 
        smoked: false,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1673646960049-2bfb54a22f4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwZmlzaCUyMHBsYXRlfGVufDF8fHx8MTc2MDY5NzcwOXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      { 
        name: 'Beef Short Ribs', 
        desc: 'With 3 sides of your choice', 
        price: 180, 
        smoked: false,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1629600938295-080a35c50302?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc2hvcnQlMjByaWJzfGVufDF8fHx8MTc2MDc5NTczNXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
    ],
    burgers: [
      { 
        name: 'Smoked Pork Burger', 
        desc: 'Juicy smoked pork patty with fresh toppings', 
        price: 85, 
        smoked: true,
        rating: 4.5,
        mealPrice: 140,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwYnVyZ2VyfGVufDF8fHx8MTc2MDc1ODEwNHww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      { 
        name: 'Smoked Chicken Burger', 
        desc: 'Tender chicken breast with special sauce', 
        price: 85, 
        smoked: true,
        rating: 4.6,
        mealPrice: 140,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwYnVyZ2VyfGVufDF8fHx8MTc2MDc1ODEwNHww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      { 
        name: 'Smoked Beef Burger', 
        desc: 'Premium beef patty with signature seasonings', 
        price: 85, 
        smoked: true,
        rating: 4.7,
        mealPrice: 140,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwYnVyZ2VyfGVufDF8fHx8MTc2MDc1ODEwNHww&ixlib=rb-4.1.0&q=80&w=1080'
      },
    ],
    fish: [
      { 
        name: 'Snoek Fish', 
        desc: 'Grilled to perfection', 
        price: 160, 
        smoked: false,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1673646960049-2bfb54a22f4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwZmlzaCUyMHBsYXRlfGVufDF8fHx8MTc2MDY5NzcwOXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
    ],
    beef: [
      { 
        name: 'Short Ribs', 
        desc: 'Served with Chips / Greek Salad', 
        price: 160, 
        smoked: false,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1629600938295-080a35c50302?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwc2hvcnQlMjByaWJzfGVufDF8fHx8MTc2MDc5NTczNXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
    ],
    sides: [
      { name: 'Garlic Bread', price: 35, image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJsaWMlMjBicmVhZHxlbnwxfHx8fDE3NjA3OTU3MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Chips', price: 35, image: 'https://images.unsplash.com/photo-1605262157780-8910063b2bf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBmcmllcyUyMGNoaXBzfGVufDF8fHx8MTc2MDc5NTczNXww&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Greek Salad', price: 35, image: 'https://images.unsplash.com/photo-1606735584785-1848fdcaea57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlayUyMHNhbGFkfGVufDF8fHx8MTc2MDc5NTczNnww&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Garlic Bun', price: 15, image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJsaWMlMjBicmVhZHxlbnwxfHx8fDE3NjA3OTU3MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Chakalaka', price: 15, image: 'https://images.unsplash.com/photo-1606735584785-1848fdcaea57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlayUyMHNhbGFkfGVufDF8fHx8MTc2MDc5NTczNnww&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Chilli Sauce', price: 15, image: 'https://images.unsplash.com/photo-1606735584785-1848fdcaea57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlayUyMHNhbGFkfGVufDF8fHx8MTc2MDc5NTczNnww&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
    pizza: [
      { name: 'Margarita', desc: 'Tomato and Mozzarella', price: 90, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MXx8fHwxNzYwNzMxNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Regina', desc: 'Ham, Mushroom and Mozzarella', price: 105, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MXx8fHwxNzYwNzMxNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Hawaiian', desc: 'Ham, Pineapple and Mozzarella', price: 105, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXdhaWlhbiUyMHBpenphfGVufDF8fHx8MTc2MDc2NzQ5OHww&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Bacon Fetta and Avo', desc: 'Bacon, Fetta cheese, Avo & Mozzarella', price: 130, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MXx8fHwxNzYwNzMxNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Chicken and Mushroom', desc: 'Chicken, Mushroom and Mozzarella', price: 145, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MXx8fHwxNzYwNzMxNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Chicken Mayo', desc: 'Chicken, Bacon, Caramelized Onion, Mayo and mozzarella', price: 150, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MXx8fHwxNzYwNzMxNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Pepperoni', desc: 'Salami and Mozzarella', price: 105, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MXx8fHwxNzYwNzMxNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Smokey Junk', desc: 'Chicken, ham, bacon, mushroom, mixed peppers, sweet peppers, Olives, bbq sauce and Mozzarella', price: 170, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MXx8fHwxNzYwNzMxNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Thai Sweet Chilli', desc: 'Chicken, Spring Onion, Sweet Peppers, Pineapple, Sweet chilli sauce and mozzarella', price: 150, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MXx8fHwxNzYwNzMxNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Chicken Prego', desc: 'Chicken, Mixed Peppers, Mushrooms, Prego sauce and mozzarella', price: 150, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MXx8fHwxNzYwNzMxNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Chicken, Bacon and Mushroom', desc: 'Chicken, Bacon, Mushroom, Barbecue sauce', price: 160, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MXx8fHwxNzYwNzMxNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Santorino', desc: 'Salami, Mushroom, Olives, Red Onion, Feta cheese and Mozzarella', price: 150, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MXx8fHwxNzYwNzMxNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Vegetarian', desc: 'Mushroom, Olives, Fetta cheese, Red Onion and Mozzarella', price: 110, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MXx8fHwxNzYwNzMxNjcxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
    subs: [
      { name: 'Smokey Junk Sub', desc: 'Garlic Loaf stuffed with pork mix, beef, chicken and mozzarella cheese', price: 180, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwYnVyZ2VyfGVufDF8fHx8MTc2MDc1ODEwNHww&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Smokey Junk Sub (Non Pork)', desc: 'Garlic Loaf stuffed with beef, chicken and mozzarella cheese', price: 160, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwYnVyZ2VyfGVufDF8fHx8MTc2MDc1ODEwNHww&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
    platters: [
      { name: 'Smokey Platter for 1', desc: 'Quarter Chicken, Half Rack Ribs, Garlic bun or Chips or Greek Salad', price: 190, serves: '1', rating: 4.6, image: 'https://images.unsplash.com/photo-1575178018553-5b4e17b751be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGxhdHRlciUyMGZlYXN0fGVufDF8fHx8MTc2MDc5NTczNnww&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'Smokey Platter for 2', desc: '2 Quarter Chickens, Half Rack Ribs, 2 Garlic buns or chips or Greek salad', price: 300, serves: '2', rating: 4.7, image: 'https://images.unsplash.com/photo-1575178018553-5b4e17b751be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGxhdHRlciUyMGZlYXN0fGVufDF8fHx8MTc2MDc5NTczNnww&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'BM Platter', desc: 'Half Chicken, Beef Short Ribs, Pork Neck or Snoek Fish, Chips or Salad', price: 400, serves: '3-4', rating: 4.8, image: 'https://images.unsplash.com/photo-1575178018553-5b4e17b751be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGxhdHRlciUyMGZlYXN0fGVufDF8fHx8MTc2MDc5NTczNnww&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'SMOKEVILLE Non-Pork Platter', desc: 'Smoked Full Chicken, Snoek Fish, Beef short ribs, 6 Winglets, Chips, Greek Salad, Garlic bun, Chakalaka & Chilli Sauce', price: 1000, serves: '5-6', featured: true, rating: 4.9, image: 'https://images.unsplash.com/photo-1575178018553-5b4e17b751be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGxhdHRlciUyMGZlYXN0fGVufDF8fHx8MTc2MDc5NTczNnww&ixlib=rb-4.1.0&q=80&w=1080' },
      { name: 'SMOKEVILLE Platter', desc: 'Smoked Full Chicken, Snoek Fish, Beef short ribs, Pork ribs, Eisbein, Chips, Greek Salad, Garlic Loaf, Chakalaka & Chilli Sauce', price: 1500, serves: '7-10', featured: true, rating: 5.0, image: 'https://images.unsplash.com/photo-1575178018553-5b4e17b751be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGxhdHRlciUyMGZlYXN0fGVufDF8fHx8MTc2MDc5NTczNnww&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  };

  // Function to create curved path layout items
  const createCurvedLayoutItems = (items: MenuItem[]) => {
    return items.map((item, index) => ({
      ...item,
      position: index % 2 === 0 ? 'left' : 'right',
      curveDirection: index % 4 < 2 ? 'down' : 'up'
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section
        className="relative h-[50vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1594266063697-304befca9629?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwcmlicyUyMHNtb2tlfGVufDF8fHx8MTc2MDcwMDQwOXww&ixlib=rb-4.1.0&q=80&w=1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#121212]/70" />
        
        {/* Smoke Effect */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            x: [-100, 100, -100],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(203, 161, 53, 0.4) 0%, transparent 70%)',
          }}
        />
        
        <div className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl mb-4 text-[#F5F5F5] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
          >
            Our Menu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-[#F5F5F5] px-4 py-2 bg-[#121212]/60 rounded-lg inline-block"
          >
            Crafted with passion, served with pride
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <Tabs defaultValue="poultry" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 mb-8 md:mb-12 bg-[#1a1a1a] p-1 gap-1 sm:gap-2">
            {['Poultry', 'Pork', 'Mains', 'Burgers', 'Pizza', 'Subs', 'Platters', 'Sides', 'Beef/Fish'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase().replace('/', '-')}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#CBA135] data-[state=active]:to-[#B36A2E] data-[state=active]:text-[#121212] transition-all text-xs sm:text-sm px-2 py-2"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Poultry */}
          <TabsContent value="poultry">
            {menuData.poultry.map((section, idx) => (
              <div key={idx} className="mb-12 md:mb-16">
                <h3 className="text-2xl sm:text-3xl text-[#CBA135] mb-6 md:mb-8 text-center">{section.category}</h3>
                <CurvedMenuLayout items={section.items} selectedMeals={selectedMeals} toggleMeal={toggleMeal} onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} />
              </div>
            ))}
          </TabsContent>

          {/* Pork */}
          <TabsContent value="pork">
            <CurvedMenuLayout items={menuData.pork} selectedMeals={selectedMeals} toggleMeal={toggleMeal} onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} />
          </TabsContent>

          {/* Mains */}
          <TabsContent value="mains">
            <CurvedMenuLayout items={menuData.mains} selectedMeals={selectedMeals} toggleMeal={toggleMeal} onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} />
          </TabsContent>

          {/* Burgers */}
          <TabsContent value="burgers">
            <div className="mb-6 md:mb-8 text-center bg-[#CBA135]/10 border border-[#CBA135]/30 rounded-xl p-4 mx-4 md:mx-0">
              <p className="text-[#F5F5F5]/90 text-sm sm:text-base md:text-lg">
                💡 <span className="text-[#CBA135] font-semibold">Make it a meal:</span> Add chips, egg & double cheese for R140
              </p>
            </div>
            <CurvedMenuLayout items={menuData.burgers} selectedMeals={selectedMeals} toggleMeal={toggleMeal} isBurger onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} />
          </TabsContent>

          {/* Pizza */}
          <TabsContent value="pizza">
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5 pointer-events-none z-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              <div className="text-[20rem]">🍕</div>
            </motion.div>
            
            <div className="relative z-10">
              <CurvedMenuLayout items={menuData.pizza} selectedMeals={selectedMeals} toggleMeal={toggleMeal} onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} />
            </div>
          </TabsContent>

          {/* Subs */}
          <TabsContent value="subs">
            <CurvedMenuLayout items={menuData.subs} selectedMeals={selectedMeals} toggleMeal={toggleMeal} onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} />
          </TabsContent>

          {/* Platters */}
          <TabsContent value="platters">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {menuData.platters.map((item, index) => (
                <PlatterItem key={index} item={item} index={index} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </TabsContent>

          {/* Sides */}
          <TabsContent value="sides">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {menuData.sides.map((item, index) => (
                <SideItemCard key={index} item={item} index={index} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </TabsContent>

          {/* Beef/Fish */}
          <TabsContent value="beef-fish">
            <CurvedMenuLayout items={[...menuData.beef, ...menuData.fish]} selectedMeals={selectedMeals} toggleMeal={toggleMeal} onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Food Detail Modal */}
      {selectedItem && (
        <FoodDetailModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={(item, quantity) => {
            for (let i = 0; i < quantity; i++) {
              handleAddToCart({ 
                name: item.name, 
                price: item.price, 
                image: item.image,
                category: 'menu'
              } as MenuItem);
            }
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}

// Curved Path Layout Component inspired by the reference image
function CurvedMenuLayout({ 
  items, 
  selectedMeals, 
  toggleMeal, 
  isBurger = false,
  onAddToCart,
  onViewDetails
}: { 
  items: MenuItem[], 
  selectedMeals: { [key: string]: boolean },
  toggleMeal: (name: string) => void,
  isBurger?: boolean,
  onAddToCart: (item: MenuItem, isMeal: boolean) => void,
  onViewDetails?: (item: MenuItem) => void
}) {
  return (
    <div className="relative py-12">
      {items.map((item, index) => {
        const isLeft = index % 2 === 0;
        const isMealSelected = selectedMeals[item.name];
        const displayPrice = isBurger && isMealSelected && item.mealPrice ? item.mealPrice : item.price;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-16 md:mb-24 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
          >
            {/* Food Image in Circle */}
            <motion.div
              className="relative flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64">
                {/* Outer decorative ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#CBA135]/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border border-[#CBA135]/50"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                />
                
                {/* Image container */}
                <div className="absolute inset-3 sm:inset-4 rounded-full overflow-hidden border-4 border-[#121212] shadow-2xl">
                  <ImageWithFallback
                    src={item.image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Price badge */}
                <motion.div
                  className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#CBA135] to-[#B36A2E] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg z-10"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-[#121212] text-sm sm:text-base font-semibold">R{displayPrice}</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Connecting Path with Decorative Elements - Hidden on mobile */}
            <div className="flex-1 relative w-full">
              {/* SVG Curved Path - Only shown on desktop */}
              <svg 
                className="hidden md:block absolute top-1/2 -translate-y-1/2 w-full h-32 pointer-events-none"
                style={{
                  left: isLeft ? '0' : 'auto',
                  right: isLeft ? 'auto' : '0',
                }}
              >
                <motion.path
                  d={isLeft 
                    ? "M 0 64 Q 50 20, 100 64 T 200 64"
                    : "M 200 64 Q 150 20, 100 64 T 0 64"
                  }
                  stroke="#CBA135"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: index * 0.1 }}
                />
                
                {/* Decorative dots */}
                <circle cx={isLeft ? "100" : "100"} cy="64" r="4" fill="#CBA135" />
                <circle cx={isLeft ? "50" : "150"} cy="40" r="3" fill="#CBA135" opacity="0.7" />
              </svg>

              {/* Content Card */}
              <motion.div
                className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 border border-[#CBA135]/20 hover:border-[#CBA135] transition-all shadow-xl w-full"
                whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(203,161,53,0.3)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg sm:text-xl md:text-2xl text-[#F5F5F5] flex items-center gap-2 flex-1">
                    {item.name}
                    {item.smoked && (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                      </motion.span>
                    )}
                  </h3>
                  {/* Show price on mobile in the card as well */}
                  <span className="md:hidden text-[#CBA135] text-lg font-semibold ml-2">R{displayPrice}</span>
                </div>
                
                {item.desc && (
                  <p className="text-[#F5F5F5]/70 text-sm sm:text-base mb-3">{item.desc}</p>
                )}

                {/* Star Rating */}
                {item.rating && (
                  <div className="flex items-center gap-1 mb-4">
                    <StarRating rating={item.rating} />
                    <span className="text-[#F5F5F5]/60 text-xs sm:text-sm ml-1">({item.rating})</span>
                  </div>
                )}

                {/* Burger Meal Option */}
                {isBurger && item.mealPrice && (
                  <motion.button
                    onClick={() => toggleMeal(item.name)}
                    className={`w-full mb-4 p-2.5 sm:p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                      isMealSelected 
                        ? 'border-[#CBA135] bg-[#CBA135]/10' 
                        : 'border-[#CBA135]/30 hover:border-[#CBA135]/50'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-[#F5F5F5] text-sm sm:text-base">
                      Make it a meal <span className="text-[#CBA135]">+R{item.mealPrice - item.price}</span>
                    </span>
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isMealSelected ? 'border-[#CBA135] bg-[#CBA135]' : 'border-[#CBA135]/50'
                    }`}>
                      {isMealSelected && <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#121212]" />}
                    </div>
                  </motion.button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => onViewDetails?.(item)}
                    variant="outline"
                    className="border-[#CBA135] text-[#CBA135] hover:bg-[#CBA135]/10 text-sm sm:text-base py-2 sm:py-3"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    Details
                  </Button>
                  <LiquidButton
                    onClick={() => onAddToCart(item, isBurger && isMealSelected)}
                    className="text-sm sm:text-base py-2 sm:py-3"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add
                  </LiquidButton>
                </div>
              </motion.div>
            </div>

            {/* Decorative accent elements - Hidden on mobile */}
            {item.smoked && (
              <motion.div
                className="hidden md:block absolute top-0 text-4xl opacity-20"
                style={{ left: isLeft ? '40%' : '60%' }}
                animate={{ 
                  y: [0, -20, 0],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
              >
                💨
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function PlatterItem({ item, index, onAddToCart }: { item: any, index: number, onAddToCart: (item: MenuItem, isMeal: boolean) => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 30, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`bg-[#1a1a1a] rounded-2xl overflow-hidden hover:ring-2 hover:ring-[#CBA135] transition-all group relative ${
        item.featured ? 'ring-2 ring-[#CBA135]/50' : ''
      }`}
      whileHover={{ scale: 1.02 }}
    >
      {/* Image */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />
        
        {item.featured && (
          <Badge className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-[#CBA135] text-[#121212] text-xs sm:text-sm">
            Featured
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl text-[#F5F5F5] mb-2">{item.name}</h3>
            <Badge className="bg-[#CBA135]/20 text-[#CBA135] border border-[#CBA135] text-xs sm:text-sm">
              Serves {item.serves}
            </Badge>
          </div>
          <span className="text-xl sm:text-2xl text-[#CBA135] font-semibold">R{item.price}</span>
        </div>
        
        <p className="text-[#F5F5F5]/70 text-sm mb-3">{item.desc}</p>

        {/* Star Rating */}
        {item.rating && (
          <div className="flex items-center gap-1 mb-4">
            <StarRating rating={item.rating} />
            <span className="text-[#F5F5F5]/60 text-xs sm:text-sm ml-1">({item.rating})</span>
          </div>
        )}

        <Button 
          onClick={() => onAddToCart(item, false)}
          className="w-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212] text-sm sm:text-base"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Order
        </Button>
      </div>
    </motion.div>
  );
}

function SideItemCard({ item, index, onAddToCart }: { item: MenuItem, index: number, onAddToCart: (item: MenuItem, isMeal: boolean) => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:ring-2 hover:ring-[#CBA135] transition-all group"
      whileHover={{ y: -5 }}
    >
      <div className="relative h-24 sm:h-32 overflow-hidden">
        <ImageWithFallback
          src={item.image || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent" />
      </div>
      
      <div className="p-3 sm:p-4">
        <h4 className="text-[#F5F5F5] text-sm sm:text-base mb-1 sm:mb-2 text-center">{item.name}</h4>
        <p className="text-[#CBA135] font-semibold text-sm sm:text-base mb-3 text-center">R{item.price}</p>
        <Button
          onClick={() => onAddToCart(item, false)}
          size="sm"
          className="w-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212] text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add
        </Button>
      </div>
    </motion.div>
  );
}

// Star Rating Component
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, index) => {
        if (index < fullStars) {
          return (
            <Star
              key={index}
              className="w-4 h-4 fill-[#CBA135] text-[#CBA135]"
            />
          );
        } else if (index === fullStars && hasHalfStar) {
          return (
            <div key={index} className="relative w-4 h-4">
              <Star className="w-4 h-4 text-[#CBA135]/30 absolute" />
              <div className="overflow-hidden w-1/2">
                <Star className="w-4 h-4 fill-[#CBA135] text-[#CBA135]" />
              </div>
            </div>
          );
        } else {
          return (
            <Star
              key={index}
              className="w-4 h-4 text-[#CBA135]/30"
            />
          );
        }
      })}
    </div>
  );
}
