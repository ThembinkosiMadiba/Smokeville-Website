import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface FoodPreference {
  spiceLevel: 'mild' | 'medium' | 'hot' | 'extra-hot';
  favoriteCategories: string[];
  dietaryRestrictions: string[];
  favoriteItems: string[];
  dislikedIngredients: string[];
}

export interface Recommendation {
  name: string;
  reason: string;
  score: number;
  category: string;
  price: number;
  image?: string;
  tags: string[];
}

// Menu items database (simplified version)
const MENU_DATABASE = [
  {
    name: 'Smoked Full Chicken',
    category: 'poultry',
    price: 190,
    tags: ['smoked', 'popular', 'protein-rich', 'family-sized'],
    spiceLevel: 'mild',
    ingredients: ['chicken', 'spices', 'smoke'],
    image: 'https://images.unsplash.com/photo-1709392975965-00889c6aa545?w=400'
  },
  {
    name: 'BBQ Ribs Platter',
    category: 'beef',
    price: 250,
    tags: ['grilled', 'premium', 'protein-rich', 'party-favorite'],
    spiceLevel: 'medium',
    ingredients: ['beef', 'ribs', 'bbq-sauce', 'smoke'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400'
  },
  {
    name: 'Margherita Pizza',
    category: 'pizza',
    price: 120,
    tags: ['vegetarian', 'classic', 'italian'],
    spiceLevel: 'mild',
    ingredients: ['cheese', 'tomato', 'basil', 'dough'],
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'
  },
  {
    name: 'Peri-Peri Chicken Pizza',
    category: 'pizza',
    price: 140,
    tags: ['spicy', 'popular', 'chicken'],
    spiceLevel: 'hot',
    ingredients: ['chicken', 'cheese', 'peri-peri', 'dough'],
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400'
  },
  {
    name: 'Beef Burger Deluxe',
    category: 'burgers',
    price: 85,
    tags: ['classic', 'filling', 'comfort-food'],
    spiceLevel: 'mild',
    ingredients: ['beef', 'cheese', 'lettuce', 'tomato', 'bun'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
  },
  {
    name: '8 Smoked Wings',
    category: 'poultry',
    price: 95,
    tags: ['smoked', 'popular', 'shareable', 'protein-rich'],
    spiceLevel: 'medium',
    ingredients: ['chicken', 'wings', 'spices', 'smoke'],
    image: 'https://images.unsplash.com/photo-1592011432621-f7f576f44484?w=400'
  },
  {
    name: 'Mogodu Special',
    category: 'traditional',
    price: 60,
    tags: ['traditional', 'monday-special', 'authentic'],
    spiceLevel: 'mild',
    ingredients: ['tripe', 'spices', 'vegetables'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'
  },
  {
    name: 'Mixed Grill Platter',
    category: 'platters',
    price: 350,
    tags: ['premium', 'variety', 'family-sized', 'grilled'],
    spiceLevel: 'medium',
    ingredients: ['chicken', 'beef', 'sausage', 'ribs', 'smoke'],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'
  },
  {
    name: 'Veggie Supreme Pizza',
    category: 'pizza',
    price: 130,
    tags: ['vegetarian', 'healthy', 'colorful'],
    spiceLevel: 'mild',
    ingredients: ['cheese', 'peppers', 'mushrooms', 'olives', 'dough'],
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400'
  },
  {
    name: 'Spicy Beef Pizza',
    category: 'pizza',
    price: 145,
    tags: ['spicy', 'beef', 'hearty'],
    spiceLevel: 'hot',
    ingredients: ['beef', 'cheese', 'jalapeños', 'onions', 'dough'],
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'
  }
];

// Get user's order history
async function getUserOrderHistory(userId: string): Promise<any[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error fetching order history:', error);
    return [];
  }
}

// Analyze user preferences from order history
export async function analyzeUserPreferences(userId: string): Promise<FoodPreference> {
  const orders = await getUserOrderHistory(userId);
  
  const categoryCount: { [key: string]: number } = {};
  const itemCount: { [key: string]: number } = {};
  
  orders.forEach(order => {
    order.items?.forEach((item: any) => {
      // Count categories
      if (item.category) {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
      }
      // Count items
      itemCount[item.name] = (itemCount[item.name] || 0) + 1;
    });
  });

  // Get top categories
  const favoriteCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([category]) => category);

  // Get favorite items
  const favoriteItems = Object.entries(itemCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([item]) => item);

  return {
    spiceLevel: 'medium',
    favoriteCategories,
    dietaryRestrictions: [],
    favoriteItems,
    dislikedIngredients: []
  };
}

// Calculate recommendation score
function calculateScore(
  item: typeof MENU_DATABASE[0],
  preferences: FoodPreference,
  orderHistory: any[]
): number {
  let score = 50; // Base score

  // Favorite category bonus
  if (preferences.favoriteCategories.includes(item.category)) {
    score += 30;
  }

  // Already ordered penalty (to promote variety)
  const timesOrdered = orderHistory.filter(order => 
    order.items?.some((i: any) => i.name === item.name)
  ).length;
  
  if (timesOrdered > 0) {
    score -= timesOrdered * 10;
  } else {
    // Bonus for trying new items
    score += 15;
  }

  // Popular items bonus
  if (item.tags.includes('popular')) {
    score += 10;
  }

  // Spice level matching
  const spiceLevels = ['mild', 'medium', 'hot', 'extra-hot'];
  const userSpiceIndex = spiceLevels.indexOf(preferences.spiceLevel);
  const itemSpiceIndex = spiceLevels.indexOf(item.spiceLevel);
  const spiceDiff = Math.abs(userSpiceIndex - itemSpiceIndex);
  score -= spiceDiff * 5;

  // Dietary restrictions
  preferences.dietaryRestrictions.forEach(restriction => {
    if (restriction === 'vegetarian' && !item.tags.includes('vegetarian')) {
      score -= 100;
    }
  });

  // Disliked ingredients
  preferences.dislikedIngredients.forEach(ingredient => {
    if (item.ingredients.includes(ingredient)) {
      score -= 50;
    }
  });

  // Premium items slight bonus
  if (item.tags.includes('premium')) {
    score += 5;
  }

  return Math.max(0, score);
}

// Generate reason for recommendation
function generateReason(
  item: typeof MENU_DATABASE[0],
  preferences: FoodPreference,
  orderHistory: any[]
): string {
  const reasons = [];

  if (preferences.favoriteCategories.includes(item.category)) {
    reasons.push(`You love ${item.category}`);
  }

  const timesOrdered = orderHistory.filter(order => 
    order.items?.some((i: any) => i.name === item.name)
  ).length;

  if (timesOrdered === 0) {
    reasons.push('Try something new');
  }

  if (item.tags.includes('popular')) {
    reasons.push('Customer favorite');
  }

  if (item.tags.includes('premium')) {
    reasons.push('Premium quality');
  }

  if (item.spiceLevel === preferences.spiceLevel) {
    reasons.push('Perfect spice level');
  }

  if (reasons.length === 0) {
    reasons.push('Recommended for you');
  }

  return reasons.slice(0, 2).join(' • ');
}

// Get personalized recommendations
export async function getPersonalizedRecommendations(
  userId: string,
  count: number = 6
): Promise<Recommendation[]> {
  const preferences = await analyzeUserPreferences(userId);
  const orderHistory = await getUserOrderHistory(userId);

  const recommendations = MENU_DATABASE.map(item => ({
    name: item.name,
    category: item.category,
    price: item.price,
    image: item.image,
    tags: item.tags,
    score: calculateScore(item, preferences, orderHistory),
    reason: generateReason(item, preferences, orderHistory)
  }));

  // Sort by score and return top recommendations
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

// Get trending items
export async function getTrendingItems(count: number = 6): Promise<Recommendation[]> {
  try {
    // Get recent orders
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map(doc => doc.data());

    // Count item popularity
    const itemCount: { [key: string]: number } = {};
    orders.forEach(order => {
      order.items?.forEach((item: any) => {
        itemCount[item.name] = (itemCount[item.name] || 0) + 1;
      });
    });

    // Get top items
    const topItems = Object.entries(itemCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([name, count]) => name);

    // Match with menu database
    return MENU_DATABASE
      .filter(item => topItems.includes(item.name))
      .map(item => ({
        name: item.name,
        category: item.category,
        price: item.price,
        image: item.image,
        tags: item.tags,
        score: 100,
        reason: 'Trending now'
      }));
  } catch (error) {
    console.error('Error fetching trending items:', error);
    // Return default popular items
    return MENU_DATABASE
      .filter(item => item.tags.includes('popular'))
      .slice(0, count)
      .map(item => ({
        name: item.name,
        category: item.category,
        price: item.price,
        image: item.image,
        tags: item.tags,
        score: 80,
        reason: 'Popular choice'
      }));
  }
}

// Get complementary items (items that go well together)
export function getComplementaryItems(itemName: string, count: number = 3): Recommendation[] {
  const complementaryPairs: { [key: string]: string[] } = {
    'Smoked Full Chicken': ['8 Smoked Wings', 'Veggie Supreme Pizza'],
    'BBQ Ribs Platter': ['Beef Burger Deluxe', 'Mixed Grill Platter'],
    'Margherita Pizza': ['Veggie Supreme Pizza', 'Peri-Peri Chicken Pizza'],
    'Peri-Peri Chicken Pizza': ['8 Smoked Wings', 'Smoked Full Chicken'],
  };

  const complements = complementaryPairs[itemName] || [];
  
  return MENU_DATABASE
    .filter(item => complements.includes(item.name))
    .slice(0, count)
    .map(item => ({
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image,
      tags: item.tags,
      score: 90,
      reason: 'Pairs well together'
    }));
}

// Get items similar to a specific item
export function getSimilarItems(itemName: string, count: number = 4): Recommendation[] {
  const currentItem = MENU_DATABASE.find(item => item.name === itemName);
  if (!currentItem) return [];

  return MENU_DATABASE
    .filter(item => 
      item.name !== itemName && 
      (item.category === currentItem.category || 
       item.tags.some(tag => currentItem.tags.includes(tag)))
    )
    .slice(0, count)
    .map(item => ({
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image,
      tags: item.tags,
      score: 85,
      reason: 'Similar to your choice'
    }));
}

// Get special offers based on time/day
export function getTimeBasedRecommendations(): Recommendation[] {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  // Monday - Mogodu special
  if (day === 1) {
    const mogodu = MENU_DATABASE.find(item => item.name === 'Mogodu Special');
    if (mogodu) {
      return [{
        name: mogodu.name,
        category: mogodu.category,
        price: mogodu.price,
        image: mogodu.image,
        tags: mogodu.tags,
        score: 100,
        reason: "It's Mogodu Monday!"
      }];
    }
  }

  // Breakfast time (6-10 AM)
  if (hour >= 6 && hour < 10) {
    return [];
  }

  // Late night (after 8 PM) - comfort food
  if (hour >= 20) {
    return MENU_DATABASE
      .filter(item => item.tags.includes('comfort-food') || item.category === 'pizza')
      .slice(0, 3)
      .map(item => ({
        name: item.name,
        category: item.category,
        price: item.price,
        image: item.image,
        tags: item.tags,
        score: 90,
        reason: 'Perfect for late night'
      }));
  }

  return [];
}
