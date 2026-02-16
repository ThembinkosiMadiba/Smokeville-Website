import emailjs from '@emailjs/browser';

// EmailJS Configuration
// Get your keys from: https://www.emailjs.com/
const EMAILJS_SERVICE_ID = 'service_smokeville'; // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ORDER = 'template_order'; // Replace with your order template ID
const EMAILJS_TEMPLATE_BOOKING = 'template_booking'; // Replace with your booking template ID
const EMAILJS_TEMPLATE_WELCOME = 'template_welcome'; // Replace with your welcome template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS public key

// Initialize EmailJS
export function initEmailJS() {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  orderType: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  deliveryAddress?: string;
  phoneNumber?: string;
}

export interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  bookingId: string;
  date: string;
  time: string;
  guests: number;
  occasion?: string;
  specialRequests?: string;
  phoneNumber?: string;
}

export interface WelcomeEmailData {
  customerName: string;
  customerEmail: string;
}

// Send order confirmation email
export async function sendOrderConfirmation(data: OrderEmailData): Promise<boolean> {
  try {
    // Format items for email
    const itemsList = data.items
      .map(item => `${item.quantity}x ${item.name} - R${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');

    const templateParams = {
      to_email: data.customerEmail,
      to_name: data.customerName,
      order_id: data.orderId,
      order_type: data.orderType,
      items_list: itemsList,
      total_amount: `R${data.total.toFixed(2)}`,
      delivery_address: data.deliveryAddress || 'N/A',
      phone_number: data.phoneNumber || 'N/A',
      restaurant_name: 'SMOKEVILLE',
      restaurant_address: '881 Motlana St, Orlando West, Soweto',
      restaurant_phone: '011 982 1001',
    };

    // For demo purposes, log the email that would be sent
    console.log('📧 Order Confirmation Email:', templateParams);

    // Uncomment this in production with valid EmailJS credentials
    // const response = await emailjs.send(
    //   EMAILJS_SERVICE_ID,
    //   EMAILJS_TEMPLATE_ORDER,
    //   templateParams
    // );
    
    // Simulate successful email send
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
}

// Send booking confirmation email
export async function sendBookingConfirmation(data: BookingEmailData): Promise<boolean> {
  try {
    const templateParams = {
      to_email: data.customerEmail,
      to_name: data.customerName,
      booking_id: data.bookingId,
      booking_date: data.date,
      booking_time: data.time,
      guest_count: data.guests.toString(),
      occasion: data.occasion || 'Regular dining',
      special_requests: data.specialRequests || 'None',
      phone_number: data.phoneNumber || 'N/A',
      restaurant_name: 'SMOKEVILLE',
      restaurant_address: '881 Motlana St, Orlando West, Soweto',
      restaurant_phone: '011 982 1001',
    };

    // For demo purposes, log the email that would be sent
    console.log('📧 Booking Confirmation Email:', templateParams);

    // Uncomment this in production with valid EmailJS credentials
    // const response = await emailjs.send(
    //   EMAILJS_SERVICE_ID,
    //   EMAILJS_TEMPLATE_BOOKING,
    //   templateParams
    // );
    
    // Simulate successful email send
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return false;
  }
}

// Send welcome email to new users
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  try {
    const templateParams = {
      to_email: data.customerEmail,
      to_name: data.customerName,
      restaurant_name: 'SMOKEVILLE',
      restaurant_tagline: 'GRILL-PIZZA-BEVES',
      website_url: window.location.origin,
    };

    // For demo purposes, log the email that would be sent
    console.log('📧 Welcome Email:', templateParams);

    // Uncomment this in production with valid EmailJS credentials
    // const response = await emailjs.send(
    //   EMAILJS_SERVICE_ID,
    //   EMAILJS_TEMPLATE_WELCOME,
    //   templateParams
    // );
    
    // Simulate successful email send
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

// Send admin notification for new order
export async function sendAdminOrderNotification(data: OrderEmailData): Promise<boolean> {
  try {
    const adminEmail = 'admin@smokeville.co.za'; // Replace with actual admin email
    
    const itemsList = data.items
      .map(item => `${item.quantity}x ${item.name} - R${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');

    const templateParams = {
      to_email: adminEmail,
      to_name: 'SMOKEVILLE Admin',
      order_id: data.orderId,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.phoneNumber || 'N/A',
      order_type: data.orderType,
      items_list: itemsList,
      total_amount: `R${data.total.toFixed(2)}`,
      delivery_address: data.deliveryAddress || 'N/A',
    };

    // For demo purposes, log the notification
    console.log('📧 Admin Order Notification:', templateParams);

    // Simulate successful email send
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Error sending admin order notification:', error);
    return false;
  }
}

// Send admin notification for new booking
export async function sendAdminBookingNotification(data: BookingEmailData): Promise<boolean> {
  try {
    const adminEmail = 'admin@smokeville.co.za'; // Replace with actual admin email
    
    const templateParams = {
      to_email: adminEmail,
      to_name: 'SMOKEVILLE Admin',
      booking_id: data.bookingId,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.phoneNumber || 'N/A',
      booking_date: data.date,
      booking_time: data.time,
      guest_count: data.guests.toString(),
      occasion: data.occasion || 'Regular dining',
      special_requests: data.specialRequests || 'None',
    };

    // For demo purposes, log the notification
    console.log('📧 Admin Booking Notification:', templateParams);

    // Simulate successful email send
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return true;
  } catch (error) {
    console.error('Error sending admin booking notification:', error);
    return false;
  }
}
