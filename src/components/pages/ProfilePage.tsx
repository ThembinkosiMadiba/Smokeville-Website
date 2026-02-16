import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, ShoppingBag, Calendar, Heart, Settings, LogOut, Phone, Mail, MapPin, Edit2, Star, Trophy, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserOrders } from '../../services/orderService';
import { getUserBookings } from '../../services/bookingService';
import { getUserReviews } from '../../services/reviewService';
import { getUserLoyalty } from '../../services/loyaltyService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner@2.0.3';
import { LoyaltyDashboard } from '../LoyaltyDashboard';
import { OrderTracker } from '../OrderTracker';
import { AIRecommendations } from '../AIRecommendations';
import type { Order } from '../../services/orderService';
import type { Booking } from '../../services/bookingService';
import type { Review } from '../../services/reviewService';
import type { UserLoyalty } from '../../services/loyaltyService';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { currentUser, userData, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loyalty, setLoyalty] = useState<UserLoyalty | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const [ordersData, bookingsData, reviewsData, loyaltyData] = await Promise.all([
        getUserOrders(currentUser.uid),
        getUserBookings(currentUser.uid),
        getUserReviews(currentUser.uid),
        getUserLoyalty(currentUser.uid),
      ]);

      setOrders(ordersData);
      setBookings(bookingsData);
      setReviews(reviewsData);
      setLoyalty(loyaltyData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      onNavigate('home');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="bg-[#1a1a1a] border-[#CBA135]/20 text-center p-8">
          <CardHeader>
            <CardTitle className="text-[#CBA135]">Login Required</CardTitle>
            <CardDescription className="text-[#F5F5F5]/60">
              Please login to view your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => onNavigate('login')}
              className="bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-8 mb-8 border border-[#CBA135]/20"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#CBA135] to-[#B36A2E] flex items-center justify-center">
                <User className="w-12 h-12 text-[#121212]" />
              </div>
              <div>
                <h1 className="text-3xl text-[#F5F5F5] mb-2">
                  {userData?.displayName || 'Guest User'}
                </h1>
                <div className="flex flex-col gap-1 text-[#F5F5F5]/60">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {currentUser.email}
                  </div>
                  {userData?.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {userData.phoneNumber}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setEditMode(!editMode)}
                className="border-[#CBA135]/30 text-[#F5F5F5] hover:bg-[#CBA135]/10"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-[#121212] rounded-xl p-4 border border-[#CBA135]/20">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-[#CBA135]" />
                <div>
                  <div className="text-2xl text-[#F5F5F5]">{orders.length}</div>
                  <div className="text-sm text-[#F5F5F5]/60">Total Orders</div>
                </div>
              </div>
            </div>
            <div className="bg-[#121212] rounded-xl p-4 border border-[#CBA135]/20">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-[#CBA135]" />
                <div>
                  <div className="text-2xl text-[#F5F5F5]">{bookings.length}</div>
                  <div className="text-sm text-[#F5F5F5]/60">Reservations</div>
                </div>
              </div>
            </div>
            <div className="bg-[#121212] rounded-xl p-4 border border-[#CBA135]/20">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-[#CBA135]" />
                <div>
                  <div className="text-2xl text-[#F5F5F5]">{reviews.length}</div>
                  <div className="text-sm text-[#F5F5F5]/60">Reviews</div>
                </div>
              </div>
            </div>
            <div className="bg-[#121212] rounded-xl p-4 border border-[#CBA135]/20">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-[#CBA135]" />
                <div>
                  <div className="text-2xl text-[#F5F5F5]">{loyalty?.points || 0}</div>
                  <div className="text-sm text-[#F5F5F5]/60">Loyalty Points</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="bg-[#1a1a1a] border border-[#CBA135]/20 mb-6">
            <TabsTrigger value="orders" className="data-[state=active]:bg-[#CBA135] data-[state=active]:text-[#121212]">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-[#CBA135] data-[state=active]:text-[#121212]">
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="data-[state=active]:bg-[#CBA135] data-[state=active]:text-[#121212]">
              <Trophy className="w-4 h-4 mr-2" />
              Loyalty & Rewards
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-[#CBA135] data-[state=active]:text-[#121212]">
              <Star className="w-4 h-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-[#CBA135] data-[state=active]:text-[#121212]">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-6">
              {/* AI Recommendations */}
              <AIRecommendations mode="personalized" onNavigate={onNavigate} limit={3} />

              {/* Active Orders with Tracker */}
              {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length > 0 && (
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#CBA135]" />
                    Active Orders
                  </h3>
                  {orders
                    .filter(o => o.status !== 'completed' && o.status !== 'cancelled')
                    .map((order) => (
                      <OrderTracker
                        key={order.id}
                        orderId={order.id || ''}
                        status={order.status as any}
                        orderType={order.orderType}
                        deliveryAddress={order.deliveryAddress}
                        items={order.items}
                      />
                    ))}
                </div>
              )}

              {/* Order History */}
              <div className="space-y-4">
                <h3>Order History</h3>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-[#CBA135] border-t-transparent rounded-full mx-auto"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <Card className="bg-[#1a1a1a] border-[#CBA135]/20 text-center p-12">
                    <ShoppingBag className="w-16 h-16 text-[#CBA135]/40 mx-auto mb-4" />
                    <CardTitle className="text-[#F5F5F5] mb-2">No Orders Yet</CardTitle>
                    <CardDescription className="text-[#F5F5F5]/60 mb-4">
                      Start your culinary journey with us!
                    </CardDescription>
                    <Button
                      onClick={() => onNavigate('menu')}
                      className="bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
                    >
                      Browse Menu
                    </Button>
                  </Card>
                ) : (
                  orders.map((order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="bg-[#1a1a1a] border-[#CBA135]/20">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-[#F5F5F5] flex items-center gap-2">
                                Order #{order.id?.substring(0, 8)}
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </CardTitle>
                              <CardDescription className="text-[#F5F5F5]/60">
                                {order.createdAt.toLocaleDateString()} at {order.createdAt.toLocaleTimeString()}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl text-[#CBA135]">R{order.total.toFixed(2)}</div>
                              <Badge variant="outline" className="border-[#CBA135]/30 text-[#F5F5F5]">
                                {order.orderType}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-[#F5F5F5]/80">
                                <span>
                                  {item.quantity}x {item.name}
                                </span>
                                <span>R{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          {order.deliveryAddress && (
                            <div className="mt-4 pt-4 border-t border-[#CBA135]/20 flex items-start gap-2 text-[#F5F5F5]/60">
                              <MapPin className="w-4 h-4 mt-1" />
                              <span>{order.deliveryAddress}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-[#CBA135] border-t-transparent rounded-full mx-auto"></div>
                </div>
              ) : bookings.length === 0 ? (
                <Card className="bg-[#1a1a1a] border-[#CBA135]/20 text-center p-12">
                  <Calendar className="w-16 h-16 text-[#CBA135]/40 mx-auto mb-4" />
                  <CardTitle className="text-[#F5F5F5] mb-2">No Reservations</CardTitle>
                  <CardDescription className="text-[#F5F5F5]/60 mb-4">
                    Book a table and experience SMOKEVILLE
                  </CardDescription>
                  <Button
                    onClick={() => onNavigate('bookings')}
                    className="bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
                  >
                    Make a Reservation
                  </Button>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="bg-[#1a1a1a] border-[#CBA135]/20">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-[#F5F5F5] flex items-center gap-2">
                              Table for {booking.guests}
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="text-[#F5F5F5]/60">
                              {booking.date.toLocaleDateString()} at {booking.time}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="border-[#CBA135]/30 text-[#CBA135]">
                            Booking #{booking.id?.substring(0, 8)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {booking.occasion && (
                          <div className="mb-2 text-[#F5F5F5]/80">
                            <span className="text-[#CBA135]">Occasion:</span> {booking.occasion}
                          </div>
                        )}
                        {booking.specialRequests && (
                          <div className="text-[#F5F5F5]/60 text-sm">
                            <span className="text-[#CBA135]">Special Requests:</span> {booking.specialRequests}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Loyalty Tab */}
          <TabsContent value="loyalty">
            <LoyaltyDashboard />
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-12 h-12 border-4 border-[#CBA135] border-t-transparent rounded-full mx-auto"></div>
                </div>
              ) : reviews.length === 0 ? (
                <Card className="bg-[#1a1a1a] border-[#CBA135]/20 text-center p-12">
                  <Star className="w-16 h-16 text-[#CBA135]/40 mx-auto mb-4" />
                  <CardTitle className="text-[#F5F5F5] mb-2">No Reviews Yet</CardTitle>
                  <CardDescription className="text-[#F5F5F5]/60">
                    Share your experience with us!
                  </CardDescription>
                </Card>
              ) : (
                reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="bg-[#1a1a1a] border-[#CBA135]/20">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i < review.overallRating
                                      ? 'fill-[#CBA135] text-[#CBA135]'
                                      : 'text-[#F5F5F5]/20'
                                  }`}
                                />
                              ))}
                            </div>
                            <CardDescription className="text-[#F5F5F5]/60">
                              {review.createdAt.toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[#F5F5F5]/80">{review.comment}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-[#CBA135]/20">
                          <div>
                            <div className="text-sm text-[#F5F5F5]/60">Service</div>
                            <div className="text-[#CBA135]">{review.ratings.service}/5</div>
                          </div>
                          <div>
                            <div className="text-sm text-[#F5F5F5]/60">Food</div>
                            <div className="text-[#CBA135]">{review.ratings.food}/5</div>
                          </div>
                          <div>
                            <div className="text-sm text-[#F5F5F5]/60">Ambience</div>
                            <div className="text-[#CBA135]">{review.ratings.ambience}/5</div>
                          </div>
                          <div>
                            <div className="text-sm text-[#F5F5F5]/60">Value</div>
                            <div className="text-[#CBA135]">{review.ratings.value}/5</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-[#1a1a1a] border-[#CBA135]/20">
              <CardHeader>
                <CardTitle className="text-[#F5F5F5]">Account Settings</CardTitle>
                <CardDescription className="text-[#F5F5F5]/60">
                  Manage your account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#F5F5F5]">Full Name</Label>
                    <Input
                      value={userData?.displayName || ''}
                      disabled={!editMode}
                      className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#F5F5F5]">Email</Label>
                    <Input
                      value={currentUser.email || ''}
                      disabled
                      className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#F5F5F5]">Phone Number</Label>
                    <Input
                      value={userData?.phoneNumber || ''}
                      disabled={!editMode}
                      className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5]"
                    />
                  </div>
                </div>
                {editMode && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      className="bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
                      onClick={() => {
                        toast.success('Profile updated successfully');
                        setEditMode(false);
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditMode(false)}
                      className="border-[#CBA135]/30 text-[#F5F5F5]"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
