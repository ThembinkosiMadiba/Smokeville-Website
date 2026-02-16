import { loadStripe, Stripe } from '@stripe/stripe-js';

// NOTE: Replace with your actual Stripe publishable key
// Get this from: https://dashboard.stripe.com/apikeys
const STRIPE_PUBLISHABLE_KEY = 'pk_test_YOUR_PUBLISHABLE_KEY_HERE';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export interface PaymentIntent {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
}

// Create a payment intent (in production, this would be done on your backend)
export async function createPaymentIntent(amount: number, currency: string = 'ZAR'): Promise<string> {
  // In a real implementation, you would call your backend API here
  // The backend would create a PaymentIntent using Stripe's secret key
  // and return the client secret to the frontend
  
  // For demo purposes, we'll simulate this
  // IMPORTANT: In production, NEVER expose your secret key on the frontend
  
  try {
    // Simulated API call to your backend
    // const response = await fetch('/api/create-payment-intent', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ amount, currency }),
    // });
    // const { clientSecret } = await response.json();
    // return clientSecret;
    
    // For now, return a mock client secret
    // In production, replace this with actual backend call
    console.warn('⚠️ Using mock payment. Implement backend payment processing for production!');
    return 'mock_client_secret_' + Date.now();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to initialize payment');
  }
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

// Process payment using Stripe
export async function processPayment(
  amount: number,
  cardElement: any,
  stripe: Stripe | null
): Promise<PaymentResult> {
  if (!stripe) {
    return { success: false, error: 'Stripe not initialized' };
  }

  try {
    const clientSecret = await createPaymentIntent(amount * 100); // Convert to cents
    
    // In production, use actual Stripe payment confirmation
    // const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    //   payment_method: {
    //     card: cardElement,
    //   },
    // });
    
    // For demo purposes, simulate successful payment
    const mockPaymentIntent = {
      id: 'pi_' + Math.random().toString(36).substring(7),
      status: 'succeeded',
    };
    
    if (mockPaymentIntent.status === 'succeeded') {
      return {
        success: true,
        paymentIntentId: mockPaymentIntent.id,
      };
    } else {
      return {
        success: false,
        error: 'Payment failed',
      };
    }
  } catch (error: any) {
    console.error('Payment error:', error);
    return {
      success: false,
      error: error.message || 'Payment processing failed',
    };
  }
}

// Mock payment for demo purposes
export async function mockPaymentSuccess(amount: number): Promise<PaymentResult> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    paymentIntentId: 'pi_mock_' + Date.now(),
  };
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'eft';
  last4?: string;
  brand?: string;
}

export const PAYMENT_METHODS = {
  CARD: 'card',
  CASH: 'cash',
  EFT: 'eft',
} as const;
