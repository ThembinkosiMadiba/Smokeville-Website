import { useState } from 'react';
import { Plus, Minus, Trash2, ShoppingBag, UtensilsCrossed, Package, Bike, MapPin, CreditCard, Banknote, Building2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useCart, OrderType } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { createOrder } from '../../services/orderService';
import { mockPaymentSuccess, PAYMENT_METHODS } from '../../services/paymentService';
import { sendOrderConfirmation, sendAdminOrderNotification } from '../../services/emailService';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

interface OrderPageProps {
  onNavigate?: (page: string) => void;
}

export function OrderPage({ onNavigate }: OrderPageProps = {}) {
  const { items, updateQuantity, removeItem, total, itemCount, orderType, setOrderType, deliveryFee, grandTotal, clearCart } = useCart();
  const { currentUser, userData } = useAuth();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS.CARD);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleIncrement = (id: string, currentQuantity: number) => {
    updateQuantity(id, currentQuantity + 1);
  };

  const handleDecrement = (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
    } else {
      removeItem(id);
    }
  };

  const handleCheckout = async () => {
    // Validate user is logged in
    if (!currentUser || !userData) {
      toast.error('Please login to place an order');
      return;
    }

    // Validate items
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Validate delivery address if delivery is selected
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }

    // Validate phone number
    if (!phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    setIsProcessing(true);

    try {
      // Process payment if card payment is selected
      let paymentIntentId: string | undefined;
      
      if (paymentMethod === PAYMENT_METHODS.CARD) {
        toast.info('Processing payment...');
        const paymentResult = await mockPaymentSuccess(grandTotal);
        
        if (!paymentResult.success) {
          toast.error(paymentResult.error || 'Payment failed');
          setIsProcessing(false);
          return;
        }
        
        paymentIntentId = paymentResult.paymentIntentId;
        toast.success('Payment successful!');
      }

      const orderData: any = {
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        userName: userData.displayName || 'Guest',
        items: items,
        orderType: orderType,
        subtotal: total,
        deliveryFee: deliveryFee,
        total: grandTotal,
        status: 'pending' as const,
        phoneNumber: phoneNumber,
        paymentMethod: paymentMethod,
      };

      // Only add optional fields if they have values
      if (orderType === 'delivery' && deliveryAddress) {
        orderData.deliveryAddress = deliveryAddress;
      }
      if (orderType === 'delivery' && deliveryInstructions) {
        orderData.deliveryInstructions = deliveryInstructions;
      }
      if (paymentIntentId) {
        orderData.paymentIntentId = paymentIntentId;
      }

      const orderId = await createOrder(orderData);
      
      toast.success('Order placed successfully!', {
        description: `Order ID: ${orderId.substring(0, 8)}...`,
      });

      // Send email notifications
      const emailData = {
        customerName: userData.displayName || 'Guest',
        customerEmail: currentUser.email || '',
        orderId: orderId,
        orderType: orderType,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: grandTotal,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        phoneNumber: phoneNumber,
      };

      // Send emails in parallel (don't wait for them)
      Promise.all([
        sendOrderConfirmation(emailData),
        sendAdminOrderNotification(emailData),
      ]).then(() => {
        toast.success('Confirmation email sent!');
      }).catch(() => {
        console.log('Email notification failed (non-critical)');
      });

      // Clear cart and reset form
      clearCart();
      setDeliveryAddress('');
      setDeliveryInstructions('');
      setPhoneNumber('');
      setPaymentMethod(PAYMENT_METHODS.CARD);

      // Show success message with estimated time
      const estimatedTime = orderType === 'delivery' ? '45-60 minutes' : 
                           orderType === 'takeaway' ? '20-30 minutes' : 
                           '15-20 minutes';
      
      setTimeout(() => {
        toast.info(`Estimated ${orderType === 'eat-in' ? 'preparation' : 'ready'} time: ${estimatedTime}`);
      }, 1500);

    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const orderTypeOptions: { type: OrderType; label: string; icon: typeof UtensilsCrossed; description: string }[] = [
    { 
      type: 'eat-in', 
      label: 'Eat-In', 
      icon: UtensilsCrossed,
      description: 'Dine at our restaurant' 
    },
    { 
      type: 'takeaway', 
      label: 'Takeaway', 
      icon: Package,
      description: 'Pick up your order' 
    },
    { 
      type: 'delivery', 
      label: 'Delivery', 
      icon: Bike,
      description: 'R35 delivery fee' 
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl mb-12 text-center text-[#CBA135]">Shopping Cart</h1>

        {/* Cart Summary */}
        <div className="bg-[#1a1a1a] rounded-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="w-6 h-6 text-[#CBA135]" />
            <h2 className="text-2xl text-[#F5F5F5]">Your Order</h2>
            <Badge className="ml-auto bg-[#CBA135] text-[#121212]">
              {itemCount}
            </Badge>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-20 h-20 text-[#CBA135]/20 mx-auto mb-4" />
              <p className="text-[#F5F5F5]/60 text-xl mb-2">Your cart is empty</p>
              <p className="text-[#F5F5F5]/40 mb-8">
                Add items from our menu to get started
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => onNavigate?.('menu')}
                  className="bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
                >
                  View Menu
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Order Type Selector */}
              <div className="mb-8 pb-8 border-b border-[#CBA135]/20">
                <h3 className="text-lg text-[#F5F5F5] mb-4">Select Order Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {orderTypeOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = orderType === option.type;
                    return (
                      <motion.button
                        key={option.type}
                        onClick={() => setOrderType(option.type)}
                        className={`relative p-6 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-[#CBA135] bg-[#CBA135]/10'
                            : 'border-[#CBA135]/20 bg-[#121212] hover:border-[#CBA135]/40'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="selected-order-type"
                            className="absolute inset-0 border-2 border-[#CBA135] rounded-xl"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        <div className="relative z-10">
                          <Icon
                            className={`w-8 h-8 mx-auto mb-3 ${
                              isSelected ? 'text-[#CBA135]' : 'text-[#F5F5F5]/60'
                            }`}
                          />
                          <h4
                            className={`mb-1 ${
                              isSelected ? 'text-[#CBA135]' : 'text-[#F5F5F5]'
                            }`}
                          >
                            {option.label}
                          </h4>
                          <p className="text-sm text-[#F5F5F5]/60">
                            {option.description}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                
                {/* Contact & Delivery Information */}
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-[#F5F5F5] mb-2">
                      Phone Number *
                    </label>
                    <Input
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+27 123 456 7890"
                      type="tel"
                      className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5]"
                    />
                  </div>
                  
                  {orderType === 'delivery' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-[#F5F5F5] mb-2">
                          <MapPin className="w-4 h-4 inline mr-2" />
                          Delivery Address *
                        </label>
                        <Input
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Enter your delivery address"
                          className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#F5F5F5] mb-2">
                          Delivery Instructions (Optional)
                        </label>
                        <Textarea
                          value={deliveryInstructions}
                          onChange={(e) => setDeliveryInstructions(e.target.value)}
                          placeholder="e.g., Ring the doorbell, Gate code, etc."
                          rows={2}
                          className="bg-[#121212] border-[#CBA135]/30 text-[#F5F5F5] resize-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="mb-8 pb-8 border-b border-[#CBA135]/20">
                <h3 className="text-lg text-[#F5F5F5] mb-4">Payment Method</h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Label
                      htmlFor="card"
                      className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === PAYMENT_METHODS.CARD
                          ? 'border-[#CBA135] bg-[#CBA135]/10'
                          : 'border-[#CBA135]/20 bg-[#121212] hover:border-[#CBA135]/40'
                      }`}
                    >
                      <RadioGroupItem value={PAYMENT_METHODS.CARD} id="card" className="border-[#CBA135]" />
                      <div className="flex items-center gap-3">
                        <CreditCard className={`w-6 h-6 ${paymentMethod === PAYMENT_METHODS.CARD ? 'text-[#CBA135]' : 'text-[#F5F5F5]/60'}`} />
                        <div>
                          <div className={`${paymentMethod === PAYMENT_METHODS.CARD ? 'text-[#CBA135]' : 'text-[#F5F5F5]'}`}>
                            Card
                          </div>
                          <div className="text-xs text-[#F5F5F5]/60">Secure payment</div>
                        </div>
                      </div>
                    </Label>

                    <Label
                      htmlFor="cash"
                      className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === PAYMENT_METHODS.CASH
                          ? 'border-[#CBA135] bg-[#CBA135]/10'
                          : 'border-[#CBA135]/20 bg-[#121212] hover:border-[#CBA135]/40'
                      }`}
                    >
                      <RadioGroupItem value={PAYMENT_METHODS.CASH} id="cash" className="border-[#CBA135]" />
                      <div className="flex items-center gap-3">
                        <Banknote className={`w-6 h-6 ${paymentMethod === PAYMENT_METHODS.CASH ? 'text-[#CBA135]' : 'text-[#F5F5F5]/60'}`} />
                        <div>
                          <div className={`${paymentMethod === PAYMENT_METHODS.CASH ? 'text-[#CBA135]' : 'text-[#F5F5F5]'}`}>
                            Cash
                          </div>
                          <div className="text-xs text-[#F5F5F5]/60">Pay on {orderType === 'delivery' ? 'delivery' : 'arrival'}</div>
                        </div>
                      </div>
                    </Label>

                    <Label
                      htmlFor="eft"
                      className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === PAYMENT_METHODS.EFT
                          ? 'border-[#CBA135] bg-[#CBA135]/10'
                          : 'border-[#CBA135]/20 bg-[#121212] hover:border-[#CBA135]/40'
                      }`}
                    >
                      <RadioGroupItem value={PAYMENT_METHODS.EFT} id="eft" className="border-[#CBA135]" />
                      <div className="flex items-center gap-3">
                        <Building2 className={`w-6 h-6 ${paymentMethod === PAYMENT_METHODS.EFT ? 'text-[#CBA135]' : 'text-[#F5F5F5]/60'}`} />
                        <div>
                          <div className={`${paymentMethod === PAYMENT_METHODS.EFT ? 'text-[#CBA135]' : 'text-[#F5F5F5]'}`}>
                            EFT
                          </div>
                          <div className="text-xs text-[#F5F5F5]/60">Bank transfer</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                
                {paymentMethod === PAYMENT_METHODS.CARD && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 bg-[#CBA135]/10 border border-[#CBA135]/30 rounded-lg"
                  >
                    <p className="text-sm text-[#F5F5F5]/80">
                      💳 <strong>Demo Mode:</strong> Payment processing is simulated. In production, enter your card details securely via Stripe.
                    </p>
                  </motion.div>
                )}
                
                {paymentMethod === PAYMENT_METHODS.EFT && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 bg-[#1a1a1a] border border-[#CBA135]/30 rounded-lg"
                  >
                    <p className="text-sm text-[#F5F5F5] mb-2">Bank Details:</p>
                    <div className="text-sm text-[#F5F5F5]/80 space-y-1">
                      <div>Bank: FNB</div>
                      <div>Account Name: SMOKEVILLE PTY LTD</div>
                      <div>Account Number: 62XXXXXXXXX</div>
                      <div>Branch Code: 250655</div>
                      <div className="mt-2 text-[#CBA135]">Reference: Order will be confirmed after payment verification</div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="space-y-6 mb-8">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-6 border-b border-[#CBA135]/20 last:border-b-0"
                  >
                    {item.image && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg text-[#F5F5F5] mb-1">
                        {item.name}
                      </h3>
                      {item.category && (
                        <p className="text-[#F5F5F5]/40 text-sm mb-2">
                          {item.category}
                        </p>
                      )}
                      <p className="text-[#CBA135] mb-3">R{item.price}</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDecrement(item.id, item.quantity)}
                          className="w-8 h-8 bg-[#121212] rounded flex items-center justify-center hover:bg-[#CBA135]/20 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-[#F5F5F5]" />
                        </button>
                        <span className="text-[#F5F5F5] w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrement(item.id, item.quantity)}
                          className="w-8 h-8 bg-[#121212] rounded flex items-center justify-center hover:bg-[#CBA135]/20 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-[#F5F5F5]" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-red-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#CBA135]">
                        R{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-8 pt-6 border-t border-[#CBA135]/20">
                {/* Order Type Summary */}
                <div className="bg-[#121212] rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 text-[#CBA135]">
                    {orderType === 'eat-in' && <UtensilsCrossed className="w-5 h-5" />}
                    {orderType === 'takeaway' && <Package className="w-5 h-5" />}
                    {orderType === 'delivery' && <Bike className="w-5 h-5" />}
                    <span className="capitalize">{orderType === 'eat-in' ? 'Eat-In' : orderType === 'takeaway' ? 'Takeaway' : 'Delivery'}</span>
                  </div>
                  {orderType === 'eat-in' && (
                    <p className="text-sm text-[#F5F5F5]/60 mt-2">
                      We'll prepare your meal for dine-in service
                    </p>
                  )}
                  {orderType === 'takeaway' && (
                    <p className="text-sm text-[#F5F5F5]/60 mt-2">
                      Ready for pickup at: 881 Motlana St, Orlando West, Soweto
                    </p>
                  )}
                  {orderType === 'delivery' && deliveryAddress && (
                    <p className="text-sm text-[#F5F5F5]/60 mt-2">
                      Delivering to: {deliveryAddress}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-between text-[#F5F5F5]/80 text-lg">
                  <span>Subtotal</span>
                  <span>R{total}</span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-[#F5F5F5]/80 text-lg">
                    <span>Delivery Fee</span>
                    <span>R{deliveryFee}</span>
                  </div>
                )}
                <div className="border-t border-[#CBA135]/20 pt-3 flex justify-between text-xl">
                  <span className="text-[#CBA135]">Total</span>
                  <span className="text-[#CBA135]">R{grandTotal}</span>
                </div>
              </div>

              {!currentUser ? (
                <div className="bg-[#CBA135]/10 border border-[#CBA135]/30 rounded-lg p-4 text-center">
                  <p className="text-[#F5F5F5] mb-3">Please login to place your order</p>
                  <Button
                    onClick={() => window.location.href = '#login'}
                    className="bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
                  >
                    Login / Sign Up
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212] text-lg py-6"
                >
                  {isProcessing ? 'Processing...' : (
                    <>
                      {orderType === 'eat-in' && 'Confirm Order - Eat-In'}
                      {orderType === 'takeaway' && 'Confirm Order - Takeaway'}
                      {orderType === 'delivery' && 'Place Order - Delivery'}
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
