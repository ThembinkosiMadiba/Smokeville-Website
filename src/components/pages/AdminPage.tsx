import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Calendar, 
  Star, 
  Mail, 
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getAllOrders, 
  getAllBookings, 
  getAllReviews,
  getAllNewsletterSubscribers,
  getDashboardStats,
  updateOrderStatus,
  updateBookingStatus,
  deleteOrder,
  deleteBooking,
  deleteReview,
  isAdmin,
} from '../../services/adminService';
import type { Order } from '../../services/orderService';
import type { Booking } from '../../services/bookingService';
import type { Review } from '../../services/reviewService';
import type { NewsletterSubscriber } from '../../services/newsletterService';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

export function AdminPage({ onNavigate }: AdminPageProps) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, ordersData, bookingsData, reviewsData, subscribersData] = await Promise.all([
        getDashboardStats(),
        getAllOrders(),
        getAllBookings(),
        getAllReviews(),
        getAllNewsletterSubscribers(),
      ]);

      setStats(statsData);
      setOrders(ordersData);
      setBookings(bookingsData);
      setReviews(reviewsData);
      setSubscribers(subscribersData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success('Order status updated');
      loadData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleBookingStatusUpdate = async (bookingId: string, status: Booking['status']) => {
    try {
      await updateBookingStatus(bookingId, status);
      toast.success('Booking status updated');
      loadData();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      await deleteOrder(orderId);
      toast.success('Order deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      await deleteBooking(bookingId);
      toast.success('Booking deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await deleteReview(reviewId);
      toast.success('Review deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  // Check if user is admin
  if (!currentUser || !isAdmin(currentUser.uid)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="bg-[#1a1a1a] border-[#CBA135]/20 text-center p-8">
          <CardHeader>
            <CardTitle className="text-[#CBA135]">Access Denied</CardTitle>
            <CardDescription className="text-[#F5F5F5]/60">
              You do not have permission to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => onNavigate('home')}
              className="bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-[#CBA135] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#F5F5F5]/60">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="smokeville-logo text-4xl md:text-5xl text-[#CBA135]">
              ADMIN DASHBOARD
            </h1>
            <Button
              onClick={loadData}
              variant="outline"
              className="border-[#CBA135]/30 text-[#F5F5F5]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          <p className="text-[#F5F5F5]/60">Manage your restaurant operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border-[#CBA135]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#F5F5F5]/60 text-sm">Total Orders</p>
                    <p className="text-3xl text-[#F5F5F5] mt-2">{stats?.totalOrders || 0}</p>
                    <p className="text-[#CBA135] text-sm mt-1">
                      {stats?.pendingOrders || 0} pending
                    </p>
                  </div>
                  <ShoppingBag className="w-12 h-12 text-[#CBA135]/40" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border-[#CBA135]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#F5F5F5]/60 text-sm">Total Revenue</p>
                    <p className="text-3xl text-[#F5F5F5] mt-2">R{stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                    <p className="text-[#CBA135] text-sm mt-1">
                      R{stats?.todayRevenue?.toFixed(2) || '0.00'} today
                    </p>
                  </div>
                  <DollarSign className="w-12 h-12 text-[#CBA135]/40" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border-[#CBA135]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#F5F5F5]/60 text-sm">Bookings</p>
                    <p className="text-3xl text-[#F5F5F5] mt-2">{stats?.totalBookings || 0}</p>
                    <p className="text-[#CBA135] text-sm mt-1">
                      {stats?.pendingBookings || 0} pending
                    </p>
                  </div>
                  <Calendar className="w-12 h-12 text-[#CBA135]/40" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] border-[#CBA135]/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#F5F5F5]/60 text-sm">Avg Rating</p>
                    <p className="text-3xl text-[#F5F5F5] mt-2">{stats?.averageRating || 0}</p>
                    <p className="text-[#CBA135] text-sm mt-1">
                      {stats?.totalReviews || 0} reviews
                    </p>
                  </div>
                  <Star className="w-12 h-12 text-[#CBA135]/40" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="bg-[#1a1a1a] border border-[#CBA135]/20 mb-6">
            <TabsTrigger value="orders" className="data-[state=active]:bg-[#CBA135] data-[state=active]:text-[#121212]">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-[#CBA135] data-[state=active]:text-[#121212]">
              <Calendar className="w-4 h-4 mr-2" />
              Bookings ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-[#CBA135] data-[state=active]:text-[#121212]">
              <Star className="w-4 h-4 mr-2" />
              Reviews ({reviews.length})
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="data-[state=active]:bg-[#CBA135] data-[state=active]:text-[#121212]">
              <Mail className="w-4 h-4 mr-2" />
              Subscribers ({subscribers.length})
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-4">
              {orders.length === 0 ? (
                <Card className="bg-[#1a1a1a] border-[#CBA135]/20 text-center p-12">
                  <ShoppingBag className="w-16 h-16 text-[#CBA135]/40 mx-auto mb-4" />
                  <CardTitle className="text-[#F5F5F5]">No Orders</CardTitle>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="bg-[#1a1a1a] border-[#CBA135]/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-[#F5F5F5] flex items-center gap-2">
                            #{order.id?.substring(0, 8)}
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="text-[#F5F5F5]/60">
                            {order.createdAt.toLocaleString()} • {order.userName}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl text-[#CBA135]">R{order.total.toFixed(2)}</div>
                          <Badge variant="outline" className="border-[#CBA135]/30 text-[#F5F5F5] mt-1">
                            {order.orderType}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-[#F5F5F5]/60 mb-2">Items:</p>
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-[#F5F5F5]/80 text-sm">
                                <span>{item.quantity}x {item.name}</span>
                                <span>R{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {order.deliveryAddress && (
                          <div className="text-sm text-[#F5F5F5]/60">
                            <strong>Delivery:</strong> {order.deliveryAddress}
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-3 border-t border-[#CBA135]/20">
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleOrderStatusUpdate(order.id!, value as Order['status'])}
                          >
                            <SelectTrigger className="w-40 bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#CBA135]/30">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="ready">Ready</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteOrder(order.id!)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <Card className="bg-[#1a1a1a] border-[#CBA135]/20 text-center p-12">
                  <Calendar className="w-16 h-16 text-[#CBA135]/40 mx-auto mb-4" />
                  <CardTitle className="text-[#F5F5F5]">No Bookings</CardTitle>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking.id} className="bg-[#1a1a1a] border-[#CBA135]/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-[#F5F5F5] flex items-center gap-2">
                            {booking.userName}
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="text-[#F5F5F5]/60">
                            {booking.date.toLocaleDateString()} at {booking.time}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-xl text-[#CBA135]">{booking.guests} Guests</div>
                          <div className="text-sm text-[#F5F5F5]/60 mt-1">{booking.phoneNumber}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {booking.occasion && (
                          <div className="text-sm text-[#F5F5F5]/80">
                            <strong className="text-[#CBA135]">Occasion:</strong> {booking.occasion}
                          </div>
                        )}
                        {booking.specialRequests && (
                          <div className="text-sm text-[#F5F5F5]/60">
                            <strong>Special Requests:</strong> {booking.specialRequests}
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-3 border-t border-[#CBA135]/20">
                          <Select
                            value={booking.status}
                            onValueChange={(value) => handleBookingStatusUpdate(booking.id!, value as Booking['status'])}
                          >
                            <SelectTrigger className="w-40 bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-[#CBA135]/30">
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBooking(booking.id!)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <Card className="bg-[#1a1a1a] border-[#CBA135]/20 text-center p-12">
                  <Star className="w-16 h-16 text-[#CBA135]/40 mx-auto mb-4" />
                  <CardTitle className="text-[#F5F5F5]">No Reviews</CardTitle>
                </Card>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id} className="bg-[#1a1a1a] border-[#CBA135]/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-[#F5F5F5]">
                            {review.userName}
                          </CardTitle>
                          <CardDescription className="text-[#F5F5F5]/60">
                            {review.createdAt.toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
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
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#F5F5F5]/80 mb-4">{review.comment}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 pb-4 border-b border-[#CBA135]/20">
                        <div>
                          <div className="text-xs text-[#F5F5F5]/60">Service</div>
                          <div className="text-[#CBA135]">{review.ratings.service}/5</div>
                        </div>
                        <div>
                          <div className="text-xs text-[#F5F5F5]/60">Food</div>
                          <div className="text-[#CBA135]">{review.ratings.food}/5</div>
                        </div>
                        <div>
                          <div className="text-xs text-[#F5F5F5]/60">Ambience</div>
                          <div className="text-[#CBA135]">{review.ratings.ambience}/5</div>
                        </div>
                        <div>
                          <div className="text-xs text-[#F5F5F5]/60">Value</div>
                          <div className="text-[#CBA135]">{review.ratings.value}/5</div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteReview(review.id!)}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Review
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers">
            <Card className="bg-[#1a1a1a] border-[#CBA135]/20">
              <CardHeader>
                <CardTitle className="text-[#F5F5F5]">Newsletter Subscribers</CardTitle>
                <CardDescription className="text-[#F5F5F5]/60">
                  Total: {subscribers.length} subscribers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {subscribers.length === 0 ? (
                    <div className="text-center py-8">
                      <Mail className="w-12 h-12 text-[#CBA135]/40 mx-auto mb-2" />
                      <p className="text-[#F5F5F5]/60">No subscribers yet</p>
                    </div>
                  ) : (
                    subscribers.map((subscriber) => (
                      <div
                        key={subscriber.id}
                        className="flex items-center justify-between p-3 bg-[#121212] rounded-lg border border-[#CBA135]/10"
                      >
                        <div>
                          <div className="text-[#F5F5F5]">{subscriber.email}</div>
                          {subscriber.name && (
                            <div className="text-sm text-[#F5F5F5]/60">{subscriber.name}</div>
                          )}
                        </div>
                        <div className="text-sm text-[#F5F5F5]/40">
                          {subscriber.subscribedAt.toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
