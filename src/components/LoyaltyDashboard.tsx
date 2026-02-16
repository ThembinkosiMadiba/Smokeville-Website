import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Flame,
  Star,
  Gift,
  TrendingUp,
  Award,
  Zap,
  Crown,
  Sparkles,
  ChevronRight,
  Lock
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  getUserLoyalty,
  redeemReward,
  LEVEL_THRESHOLDS,
  REWARDS_CATALOG,
  type UserLoyalty,
  type Achievement,
  type Reward
} from '../services/loyaltyService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';
import { HolographicCard } from './HolographicCard';
import { NeonGlow, NeonText } from './NeonGlow';

const rarityColors = {
  common: 'text-gray-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400'
};

const rarityBgColors = {
  common: 'bg-gray-500/10',
  rare: 'bg-blue-500/10',
  epic: 'bg-purple-500/10',
  legendary: 'bg-yellow-500/10'
};

export function LoyaltyDashboard() {
  const { currentUser } = useAuth();
  const [loyalty, setLoyalty] = useState<UserLoyalty | null>(null);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      loadLoyaltyData();
    }
  }, [currentUser]);

  const loadLoyaltyData = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    const data = await getUserLoyalty(currentUser.uid);
    setLoyalty(data);
    setLoading(false);
  };

  const handleRedeemReward = async (rewardId: string) => {
    if (!currentUser || !loyalty) return;

    try {
      const reward = await redeemReward(currentUser.uid, rewardId);
      if (reward) {
        toast.success('Reward Redeemed!', {
          description: `${reward.name} - Code: ${reward.code}`
        });
        await loadLoyaltyData();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to redeem reward');
    }
  };

  const spinWheel = () => {
    if (spinning) return;
    
    setSpinning(true);
    
    // Simulate wheel spin
    setTimeout(() => {
      const prizes = ['10 Points', '25 Points', '50 Points', '5% Off', 'Free Wings', 'Try Again'];
      const result = prizes[Math.floor(Math.random() * prizes.length)];
      setWheelResult(result);
      setSpinning(false);
      
      if (result !== 'Try Again') {
        toast.success(`You won: ${result}!`);
      }
    }, 3000);
  };

  if (loading || !loyalty) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-8 h-8 text-[#CBA135]" />
        </motion.div>
      </div>
    );
  }

  const currentLevelThreshold = LEVEL_THRESHOLDS[loyalty.level - 1] || 0;
  const nextLevelThreshold = LEVEL_THRESHOLDS[loyalty.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const progressToNextLevel = ((loyalty.totalPoints - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Level Card */}
        <HolographicCard>
          <Card className="bg-gradient-to-br from-[#CBA135]/20 to-zinc-900 border-[#CBA135]/30">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Crown className="w-8 h-8 text-[#CBA135]" />
                <Badge className="bg-[#CBA135] text-black border-none">
                  Level {loyalty.level}
                </Badge>
              </div>
              <NeonText className="text-3xl block mb-2">
                {loyalty.level}
              </NeonText>
              <p className="text-sm text-zinc-400">Your Level</p>
              
              {loyalty.level < LEVEL_THRESHOLDS.length && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Progress</span>
                    <span className="text-[#CBA135]">{Math.round(progressToNextLevel)}%</span>
                  </div>
                  <Progress value={progressToNextLevel} className="h-1" />
                  <p className="text-xs text-zinc-500">
                    {nextLevelThreshold - loyalty.totalPoints} points to Level {loyalty.level + 1}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </HolographicCard>

        {/* Points Card */}
        <HolographicCard>
          <Card className="bg-gradient-to-br from-blue-500/20 to-zinc-900 border-blue-500/30">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Sparkles className="w-8 h-8 text-blue-400" />
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star className="w-6 h-6 text-blue-400 fill-blue-400" />
                </motion.div>
              </div>
              <div className="text-3xl mb-2 text-blue-400">
                {loyalty.points.toLocaleString()}
              </div>
              <p className="text-sm text-zinc-400">Available Points</p>
              <p className="text-xs text-zinc-500 mt-2">
                Lifetime: {loyalty.totalPoints.toLocaleString()}
              </p>
            </div>
          </Card>
        </HolographicCard>

        {/* Streak Card */}
        <HolographicCard>
          <Card className="bg-gradient-to-br from-orange-500/20 to-zinc-900 border-orange-500/30">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Flame className="w-8 h-8 text-orange-500" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  🔥
                </motion.div>
              </div>
              <div className="text-3xl mb-2 text-orange-500">
                {loyalty.streak}
              </div>
              <p className="text-sm text-zinc-400">Day Streak</p>
              <p className="text-xs text-zinc-500 mt-2">
                Keep ordering to maintain your streak!
              </p>
            </div>
          </Card>
        </HolographicCard>

        {/* Achievements Card */}
        <HolographicCard>
          <Card className="bg-gradient-to-br from-purple-500/20 to-zinc-900 border-purple-500/30">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Trophy className="w-8 h-8 text-purple-400" />
                <Badge className="bg-purple-500 text-white border-none">
                  {loyalty.achievements.length}
                </Badge>
              </div>
              <div className="text-3xl mb-2 text-purple-400">
                {loyalty.achievements.length}
              </div>
              <p className="text-sm text-zinc-400">Achievements</p>
              <p className="text-xs text-zinc-500 mt-2">
                Unlock more to earn points
              </p>
            </div>
          </Card>
        </HolographicCard>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="rewards" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-zinc-900">
          <TabsTrigger value="rewards">
            <Gift className="w-4 h-4 mr-2" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Award className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="wheel">
            <Zap className="w-4 h-4 mr-2" />
            Spin & Win
          </TabsTrigger>
        </TabsList>

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {REWARDS_CATALOG.map((reward, index) => {
              const canAfford = loyalty.points >= reward.pointsCost;
              
              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HolographicCard intensity={canAfford ? 1 : 0.3}>
                    <Card className={`bg-zinc-900 border-zinc-800 h-full ${!canAfford && 'opacity-60'}`}>
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-full ${canAfford ? 'bg-[#CBA135]/20' : 'bg-zinc-800'}`}>
                            <Gift className={`w-6 h-6 ${canAfford ? 'text-[#CBA135]' : 'text-zinc-600'}`} />
                          </div>
                          {!canAfford && <Lock className="w-5 h-5 text-zinc-600" />}
                        </div>

                        <div>
                          <h3 className="mb-2">{reward.name}</h3>
                          <p className="text-sm text-zinc-400">{reward.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-[#CBA135] fill-[#CBA135]" />
                            <span className="text-[#CBA135]">{reward.pointsCost}</span>
                          </div>
                          
                          <Button
                            size="sm"
                            disabled={!canAfford}
                            onClick={() => handleRedeemReward(reward.id)}
                            className={canAfford ? 'bg-[#CBA135] hover:bg-[#B8962F] text-black' : ''}
                          >
                            {canAfford ? 'Redeem' : 'Locked'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </HolographicCard>
                </motion.div>
              );
            })}
          </div>

          {/* Active Rewards */}
          {loyalty.rewards.filter(r => !r.usedAt).length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#CBA135]" />
                Your Active Rewards
              </h3>
              <div className="space-y-3">
                {loyalty.rewards
                  .filter(r => !r.usedAt)
                  .map((reward, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NeonGlow intensity="low">
                        <Card className="bg-zinc-900 border-[#CBA135]/30">
                          <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-full bg-[#CBA135]/20">
                                <Gift className="w-5 h-5 text-[#CBA135]" />
                              </div>
                              <div>
                                <h4 className="mb-1">{reward.name}</h4>
                                <p className="text-sm text-zinc-400">Code: {reward.code}</p>
                                {reward.expiresAt && (
                                  <p className="text-xs text-zinc-500 mt-1">
                                    Expires: {new Date(reward.expiresAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-zinc-600" />
                          </div>
                        </Card>
                      </NeonGlow>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loyalty.achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <HolographicCard>
                  <Card className={`bg-zinc-900 border-zinc-800 ${rarityBgColors[achievement.rarity]}`}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <motion.div
                          className="text-4xl"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {achievement.icon}
                        </motion.div>
                        <Badge className={`${rarityBgColors[achievement.rarity]} ${rarityColors[achievement.rarity]} border-none`}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      
                      <h4 className="mb-2">{achievement.name}</h4>
                      <p className="text-sm text-zinc-400 mb-4">{achievement.description}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-[#CBA135] fill-[#CBA135]" />
                          <span className="text-[#CBA135]">+{achievement.points}</span>
                        </div>
                        <span className="text-xs text-zinc-500">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Card>
                </HolographicCard>
              </motion.div>
            ))}
          </div>

          {loyalty.achievements.length === 0 && (
            <Card className="bg-zinc-900 border-zinc-800 p-12 text-center">
              <Trophy className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <h3 className="mb-2 text-zinc-400">No Achievements Yet</h3>
              <p className="text-sm text-zinc-500">
                Start ordering to unlock achievements and earn points!
              </p>
            </Card>
          )}
        </TabsContent>

        {/* Spin & Win Tab */}
        <TabsContent value="wheel" className="mt-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <div className="p-8">
              <div className="max-w-md mx-auto text-center space-y-6">
                <div>
                  <h3 className="mb-2">Daily Spin & Win</h3>
                  <p className="text-sm text-zinc-400">
                    Spin the wheel once per day for a chance to win rewards!
                  </p>
                </div>

                {/* Wheel */}
                <div className="relative">
                  <motion.div
                    className="w-64 h-64 mx-auto rounded-full bg-gradient-to-br from-[#CBA135]/20 to-purple-500/20 border-4 border-[#CBA135] flex items-center justify-center"
                    animate={{
                      rotate: spinning ? 360 * 5 : 0,
                    }}
                    transition={{
                      duration: spinning ? 3 : 0,
                      ease: 'easeOut'
                    }}
                  >
                    <NeonGlow intensity="high" pulse>
                      <div className="w-48 h-48 rounded-full bg-zinc-900 flex items-center justify-center">
                        <Zap className="w-16 h-16 text-[#CBA135]" />
                      </div>
                    </NeonGlow>
                  </motion.div>

                  {/* Pointer */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#CBA135]" />
                  </div>
                </div>

                {/* Result */}
                <AnimatePresence>
                  {wheelResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="p-4 bg-[#CBA135]/20 border border-[#CBA135]/30 rounded-lg"
                    >
                      <NeonText className="text-xl">
                        {wheelResult}
                      </NeonText>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Spin Button */}
                <Button
                  size="lg"
                  onClick={spinWheel}
                  disabled={spinning}
                  className="bg-[#CBA135] hover:bg-[#B8962F] text-black w-full"
                >
                  {spinning ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="mr-2"
                      >
                        <Sparkles className="w-5 h-5" />
                      </motion.div>
                      Spinning...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Spin the Wheel
                    </>
                  )}
                </Button>

                <p className="text-xs text-zinc-500">
                  Cost: 50 points per spin
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
