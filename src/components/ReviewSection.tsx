import { useState } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface Review {
  id: string;
  name: string;
  date: string;
  comment: string;
  ratings: {
    service: number;
    food: number;
    ambience: number;
    value: number;
  };
  likes: number;
}

export function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      name: 'Thabo M.',
      date: '15 Jan 2025',
      comment: 'Absolutely incredible experience! The smoked ribs were fall-off-the-bone tender, and the service was impeccable. The ambience really captures the essence of Soweto.',
      ratings: { service: 5, food: 5, ambience: 5, value: 4 },
      likes: 47
    },
    {
      id: '2',
      name: 'Sarah K.',
      date: '10 Jan 2025',
      comment: 'Best pizza in Soweto! The wood-fired crust is perfect. Great value for money and the staff is so friendly. Will definitely come back!',
      ratings: { service: 4, food: 5, ambience: 4, value: 5 },
      likes: 32
    },
    {
      id: '3',
      name: 'Michael D.',
      date: '5 Jan 2025',
      comment: 'The SMOKEVILLE platter is a must-try! Perfect for groups. Loved the live jazz night atmosphere.',
      ratings: { service: 5, food: 5, ambience: 5, value: 4 },
      likes: 28
    }
  ]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    comment: '',
    ratings: { service: 0, food: 0, ambience: 0, value: 0 }
  });

  const calculateOverallRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => {
      const avg = (review.ratings.service + review.ratings.food + review.ratings.ambience + review.ratings.value) / 4;
      return sum + avg;
    }, 0);
    return total / reviews.length;
  };

  const calculateCategoryAverage = (category: keyof Review['ratings']) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.ratings[category], 0);
    return total / reviews.length;
  };

  const getCategoryPercentage = (category: keyof Review['ratings']) => {
    return (calculateCategoryAverage(category) / 5) * 100;
  };

  const getRatingLabel = (percentage: number) => {
    if (percentage >= 90) return { label: 'Excellent', color: 'text-green-500' };
    if (percentage >= 75) return { label: 'Great', color: 'text-blue-500' };
    if (percentage >= 60) return { label: 'Good', color: 'text-[#CBA135]' };
    if (percentage >= 40) return { label: 'Fair', color: 'text-orange-500' };
    return { label: 'Needs Improvement', color: 'text-red-500' };
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReview.name || !newReview.comment) {
      toast.error('Please fill in all fields');
      return;
    }

    const allRatingsGiven = Object.values(newReview.ratings).every(rating => rating > 0);
    if (!allRatingsGiven) {
      toast.error('Please rate all categories');
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      name: newReview.name,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      comment: newReview.comment,
      ratings: newReview.ratings,
      likes: 0
    };

    setReviews([review, ...reviews]);
    setNewReview({
      name: '',
      comment: '',
      ratings: { service: 0, food: 0, ambience: 0, value: 0 }
    });
    setShowReviewForm(false);
    toast.success('Thank you for your review!');
  };

  const handleLike = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, likes: review.likes + 1 }
        : review
    ));
  };

  const overallRating = calculateOverallRating();

  return (
    <section className="py-20 px-4 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl mb-12 text-center text-[#CBA135]">
            Reviews & Comments
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Overall Rating Section */}
            <div className="bg-[#1a1a1a] rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="text-6xl md:text-7xl mb-4 text-[#F5F5F5]">
                  {overallRating.toFixed(2)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-8 h-8 ${
                        index < Math.floor(overallRating)
                          ? 'fill-[#CBA135] text-[#CBA135]'
                          : 'text-[#CBA135]/30'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[#F5F5F5]/60">({reviews.length} Reviews)</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl text-[#F5F5F5] mb-4">Top Reviews</h3>
                {reviews.slice(0, 2).map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#121212] rounded-lg p-4 border border-[#CBA135]/20"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#CBA135]/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-[#CBA135]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-[#F5F5F5]">{review.name}</h4>
                          <span className="text-xs text-[#F5F5F5]/40">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, index) => {
                            const avgRating = (review.ratings.service + review.ratings.food + review.ratings.ambience + review.ratings.value) / 4;
                            return (
                              <Star
                                key={index}
                                className={`w-3 h-3 ${
                                  index < Math.floor(avgRating)
                                    ? 'fill-[#CBA135] text-[#CBA135]'
                                    : 'text-[#CBA135]/30'
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <p className="text-[#F5F5F5]/70 text-sm mb-3">{review.comment}</p>
                    <button
                      onClick={() => handleLike(review.id)}
                      className="flex items-center gap-2 text-[#CBA135] hover:text-[#B36A2E] transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{review.likes} Liked</span>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Category Ratings */}
            <div className="bg-[#1a1a1a] rounded-2xl p-8">
              <h3 className="text-2xl text-[#F5F5F5] mb-6">Rating Breakdown</h3>
              
              <div className="space-y-6">
                {(['service', 'food', 'ambience', 'value'] as const).map((category) => {
                  const percentage = getCategoryPercentage(category);
                  const { label, color } = getRatingLabel(percentage);
                  const average = calculateCategoryAverage(category);

                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-[#F5F5F5] capitalize">{category}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#F5F5F5]/60">
                            {average.toFixed(1)}/5.0
                          </span>
                          <span className={`text-sm ${color}`}>{label}</span>
                        </div>
                      </div>
                      <div className="relative h-3 bg-[#121212] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#CBA135] to-[#B36A2E] rounded-full"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#F5F5F5]/40">{percentage.toFixed(0)}%</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Write Review Button/Form */}
          {!showReviewForm ? (
            <div className="text-center">
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212] text-lg px-8 py-6"
              >
                Write a Review
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a1a1a] rounded-2xl p-8"
            >
              <h3 className="text-2xl text-[#F5F5F5] mb-6">Share Your Experience</h3>
              
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-[#F5F5F5] mb-2">Your Name</label>
                  <Input
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    placeholder="Enter your name"
                    className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(['service', 'food', 'ambience', 'value'] as const).map((category) => (
                    <div key={category}>
                      <label className="block text-[#F5F5F5] mb-2 capitalize">
                        Rate our {category}
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setNewReview({
                              ...newReview,
                              ratings: { ...newReview.ratings, [category]: rating }
                            })}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                rating <= newReview.ratings[category]
                                  ? 'fill-[#CBA135] text-[#CBA135]'
                                  : 'text-[#CBA135]/30'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-[#F5F5F5] mb-2">Your Review</label>
                  <Textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Tell us about your experience at SMOKEVILLE..."
                    rows={4}
                    className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5] resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
                  >
                    Submit Review
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    variant="outline"
                    className="border-[#CBA135]/30 text-[#F5F5F5] hover:bg-[#CBA135]/10"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* All Reviews */}
          <div className="mt-12">
            <h3 className="text-2xl text-[#F5F5F5] mb-6">All Reviews</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#CBA135]/20"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#CBA135]/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-[#CBA135]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-lg text-[#F5F5F5]">{review.name}</h4>
                        <span className="text-sm text-[#F5F5F5]/40">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, index) => {
                          const avgRating = (review.ratings.service + review.ratings.food + review.ratings.ambience + review.ratings.value) / 4;
                          return (
                            <Star
                              key={index}
                              className={`w-4 h-4 ${
                                index < Math.floor(avgRating)
                                  ? 'fill-[#CBA135] text-[#CBA135]'
                                  : 'text-[#CBA135]/30'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <p className="text-[#F5F5F5]/80 mb-4">{review.comment}</p>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div className="flex items-center justify-between px-3 py-2 bg-[#121212] rounded-lg">
                      <span className="text-[#F5F5F5]/60">Service:</span>
                      <div className="flex items-center gap-1">
                        {[...Array(review.ratings.service)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#CBA135] text-[#CBA135]" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-[#121212] rounded-lg">
                      <span className="text-[#F5F5F5]/60">Food:</span>
                      <div className="flex items-center gap-1">
                        {[...Array(review.ratings.food)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#CBA135] text-[#CBA135]" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-[#121212] rounded-lg">
                      <span className="text-[#F5F5F5]/60">Ambience:</span>
                      <div className="flex items-center gap-1">
                        {[...Array(review.ratings.ambience)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#CBA135] text-[#CBA135]" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-[#121212] rounded-lg">
                      <span className="text-[#F5F5F5]/60">Value:</span>
                      <div className="flex items-center gap-1">
                        {[...Array(review.ratings.value)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#CBA135] text-[#CBA135]" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLike(review.id)}
                    className="flex items-center gap-2 text-[#CBA135] hover:text-[#B36A2E] transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm">{review.likes} Liked</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
