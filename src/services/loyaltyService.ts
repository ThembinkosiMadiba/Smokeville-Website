import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface UserLoyalty {
  userId: string;
  points: number;
  totalPoints: number; // Lifetime points
  level: number;
  streak: number;
  lastVisit: Date;
  achievements: Achievement[];
  rewards: Reward[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  discount?: number;
  freeItem?: string;
  expiresAt?: Date;
  usedAt?: Date;
  code?: string;
}

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_ORDER: {
    id: 'first_order',
    name: 'First Bite',
    description: 'Placed your first order',
    icon: '🎉',
    points: 50,
    rarity: 'common' as const
  },
  FIVE_ORDERS: {
    id: 'five_orders',
    name: 'Regular Customer',
    description: 'Placed 5 orders',
    icon: '⭐',
    points: 100,
    rarity: 'common' as const
  },
  TEN_ORDERS: {
    id: 'ten_orders',
    name: 'Smokeville Fan',
    description: 'Placed 10 orders',
    icon: '🔥',
    points: 250,
    rarity: 'rare' as const
  },
  FIFTY_ORDERS: {
    id: 'fifty_orders',
    name: 'Smokehouse Legend',
    description: 'Placed 50 orders',
    icon: '👑',
    points: 1000,
    rarity: 'legendary' as const
  },
  WEEK_STREAK: {
    id: 'week_streak',
    name: 'Weekly Warrior',
    description: '7-day ordering streak',
    icon: '🔥',
    points: 200,
    rarity: 'rare' as const
  },
  MONTH_STREAK: {
    id: 'month_streak',
    name: 'Monthly Master',
    description: '30-day ordering streak',
    icon: '💎',
    points: 750,
    rarity: 'epic' as const
  },
  PIZZA_LOVER: {
    id: 'pizza_lover',
    name: 'Pizza Perfectionist',
    description: 'Ordered 10 pizzas',
    icon: '🍕',
    points: 150,
    rarity: 'common' as const
  },
  GRILL_MASTER: {
    id: 'grill_master',
    name: 'Grill Master',
    description: 'Ordered 10 grilled items',
    icon: '🍖',
    points: 150,
    rarity: 'common' as const
  },
  BIG_SPENDER: {
    id: 'big_spender',
    name: 'Big Spender',
    description: 'Spent R1000 in total',
    icon: '💰',
    points: 300,
    rarity: 'rare' as const
  },
  REVIEWER: {
    id: 'reviewer',
    name: 'Food Critic',
    description: 'Left 5 reviews',
    icon: '📝',
    points: 100,
    rarity: 'common' as const
  },
  EARLY_BIRD: {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Ordered before 10 AM',
    icon: '🌅',
    points: 75,
    rarity: 'common' as const
  },
  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Ordered after 10 PM',
    icon: '🦉',
    points: 75,
    rarity: 'common' as const
  },
  MOGODU_MONDAY: {
    id: 'mogodu_monday',
    name: 'Monday Special',
    description: 'Ordered on Mogodu Monday',
    icon: '🎊',
    points: 100,
    rarity: 'rare' as const
  }
};

// Level thresholds
export const LEVEL_THRESHOLDS = [
  0,     // Level 1
  100,   // Level 2
  250,   // Level 3
  500,   // Level 4
  1000,  // Level 5
  2000,  // Level 6
  3500,  // Level 7
  5500,  // Level 8
  8000,  // Level 9
  12000  // Level 10
];

// Rewards catalog
export const REWARDS_CATALOG: Reward[] = [
  {
    id: 'discount_10',
    name: '10% Off Next Order',
    description: 'Get 10% discount on your next order',
    pointsCost: 200,
    discount: 10
  },
  {
    id: 'discount_15',
    name: '15% Off Next Order',
    description: 'Get 15% discount on your next order',
    pointsCost: 350,
    discount: 15
  },
  {
    id: 'discount_20',
    name: '20% Off Next Order',
    description: 'Get 20% discount on your next order',
    pointsCost: 500,
    discount: 20
  },
  {
    id: 'free_wings',
    name: 'Free 8 Wings',
    description: 'Get a free order of 8 smoked wings',
    pointsCost: 400,
    freeItem: '8 Smoked Wings'
  },
  {
    id: 'free_pizza',
    name: 'Free Medium Pizza',
    description: 'Get a free medium pizza of your choice',
    pointsCost: 600,
    freeItem: 'Medium Pizza'
  },
  {
    id: 'free_delivery',
    name: 'Free Delivery',
    description: 'Free delivery on your next order',
    pointsCost: 150,
    discount: 0
  }
];

// Initialize user loyalty profile
export async function initUserLoyalty(userId: string): Promise<UserLoyalty> {
  const loyaltyRef = doc(db, 'loyalty', userId);
  const loyaltyDoc = await getDoc(loyaltyRef);

  if (loyaltyDoc.exists()) {
    return loyaltyDoc.data() as UserLoyalty;
  }

  const newLoyalty: UserLoyalty = {
    userId,
    points: 0,
    totalPoints: 0,
    level: 1,
    streak: 0,
    lastVisit: new Date(),
    achievements: [],
    rewards: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await setDoc(loyaltyRef, {
    ...newLoyalty,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastVisit: serverTimestamp()
  });

  return newLoyalty;
}

// Get user loyalty data
export async function getUserLoyalty(userId: string): Promise<UserLoyalty | null> {
  try {
    const loyaltyRef = doc(db, 'loyalty', userId);
    const loyaltyDoc = await getDoc(loyaltyRef);

    if (!loyaltyDoc.exists()) {
      return await initUserLoyalty(userId);
    }

    const data = loyaltyDoc.data();
    return {
      ...data,
      lastVisit: data.lastVisit?.toDate(),
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      achievements: data.achievements?.map((a: any) => ({
        ...a,
        unlockedAt: a.unlockedAt?.toDate()
      })) || [],
      rewards: data.rewards?.map((r: any) => ({
        ...r,
        expiresAt: r.expiresAt?.toDate(),
        usedAt: r.usedAt?.toDate()
      })) || []
    } as UserLoyalty;
  } catch (error) {
    console.error('Error fetching loyalty data:', error);
    return null;
  }
}

// Add points to user
export async function addPoints(userId: string, points: number, reason: string): Promise<void> {
  const loyaltyRef = doc(db, 'loyalty', userId);
  
  await updateDoc(loyaltyRef, {
    points: increment(points),
    totalPoints: increment(points),
    updatedAt: serverTimestamp()
  });

  // Check for level up
  const loyalty = await getUserLoyalty(userId);
  if (loyalty) {
    const newLevel = calculateLevel(loyalty.totalPoints);
    if (newLevel > loyalty.level) {
      await updateDoc(loyaltyRef, {
        level: newLevel
      });
    }
  }
}

// Calculate level based on points
function calculateLevel(points: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

// Unlock achievement
export async function unlockAchievement(
  userId: string, 
  achievementKey: keyof typeof ACHIEVEMENTS
): Promise<boolean> {
  const loyalty = await getUserLoyalty(userId);
  if (!loyalty) return false;

  // Check if already unlocked
  if (loyalty.achievements.some(a => a.id === ACHIEVEMENTS[achievementKey].id)) {
    return false;
  }

  const achievement: Achievement = {
    ...ACHIEVEMENTS[achievementKey],
    unlockedAt: new Date()
  };

  const loyaltyRef = doc(db, 'loyalty', userId);
  await updateDoc(loyaltyRef, {
    achievements: [...loyalty.achievements, achievement],
    updatedAt: serverTimestamp()
  });

  // Add points for achievement
  await addPoints(userId, achievement.points, `Achievement: ${achievement.name}`);

  return true;
}

// Redeem reward
export async function redeemReward(userId: string, rewardId: string): Promise<Reward | null> {
  const loyalty = await getUserLoyalty(userId);
  if (!loyalty) return null;

  const catalog = REWARDS_CATALOG.find(r => r.id === rewardId);
  if (!catalog) return null;

  if (loyalty.points < catalog.pointsCost) {
    throw new Error('Insufficient points');
  }

  const reward: Reward = {
    ...catalog,
    code: generateRewardCode(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  };

  const loyaltyRef = doc(db, 'loyalty', userId);
  await updateDoc(loyaltyRef, {
    points: increment(-catalog.pointsCost),
    rewards: [...loyalty.rewards, reward],
    updatedAt: serverTimestamp()
  });

  return reward;
}

// Generate reward code
function generateRewardCode(): string {
  return 'SMK-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Update streak
export async function updateStreak(userId: string): Promise<number> {
  const loyalty = await getUserLoyalty(userId);
  if (!loyalty) return 0;

  const now = new Date();
  const lastVisit = loyalty.lastVisit;
  const hoursSinceLastVisit = (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60);

  let newStreak = loyalty.streak;

  if (hoursSinceLastVisit < 24) {
    // Same day, no change
    return newStreak;
  } else if (hoursSinceLastVisit < 48) {
    // Next day, increment streak
    newStreak += 1;
    
    // Check for streak achievements
    if (newStreak === 7) {
      await unlockAchievement(userId, 'WEEK_STREAK');
    } else if (newStreak === 30) {
      await unlockAchievement(userId, 'MONTH_STREAK');
    }
  } else {
    // Missed a day, reset streak
    newStreak = 1;
  }

  const loyaltyRef = doc(db, 'loyalty', userId);
  await updateDoc(loyaltyRef, {
    streak: newStreak,
    lastVisit: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return newStreak;
}

// Get leaderboard
export async function getLeaderboard(limitCount: number = 10): Promise<UserLoyalty[]> {
  try {
    const q = query(
      collection(db, 'loyalty'),
      orderBy('totalPoints', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        lastVisit: data.lastVisit?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        achievements: data.achievements?.map((a: any) => ({
          ...a,
          unlockedAt: a.unlockedAt?.toDate()
        })) || [],
        rewards: data.rewards?.map((r: any) => ({
          ...r,
          expiresAt: r.expiresAt?.toDate(),
          usedAt: r.usedAt?.toDate()
        })) || []
      } as UserLoyalty;
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

// Check and award order-based achievements
export async function checkOrderAchievements(userId: string, orderCount: number, totalSpent: number): Promise<void> {
  if (orderCount === 1) {
    await unlockAchievement(userId, 'FIRST_ORDER');
  } else if (orderCount === 5) {
    await unlockAchievement(userId, 'FIVE_ORDERS');
  } else if (orderCount === 10) {
    await unlockAchievement(userId, 'TEN_ORDERS');
  } else if (orderCount === 50) {
    await unlockAchievement(userId, 'FIFTY_ORDERS');
  }

  if (totalSpent >= 1000) {
    await unlockAchievement(userId, 'BIG_SPENDER');
  }
}

// Award points for order
export async function awardOrderPoints(userId: string, orderTotal: number): Promise<void> {
  // Award 1 point per R10 spent
  const points = Math.floor(orderTotal / 10);
  await addPoints(userId, points, 'Order completed');
  await updateStreak(userId);
}
