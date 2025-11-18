import { Cart } from '@/src/type/cart';
import { ShippingInfo, BillingInfo, PaymentInfo, OrderData } from '@/src/type/checkout';

// Mock Stripe payment processing
export const processStripePayment = async (
  paymentInfo: PaymentInfo,
  amount: number
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Validate card number using Luhn algorithm (already done in validation)
  const cardNumber = paymentInfo.cardNumber.replace(/\s/g, '');

  // Mock successful payment for valid test cards
  const testCards = ['4532148803436467', '5425233430109903'];

  if (testCards.includes(cardNumber)) {
    return {
      success: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  // For other valid cards (passed Luhn check), also succeed
  return {
    success: true,
    transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
};

// Create order
export const createOrder = async (
  cart: Cart,
  shipping: ShippingInfo,
  billing: BillingInfo,
  payment: PaymentInfo
): Promise<OrderData> => {
  const subtotal = cart.totalPrice;
  const tax = subtotal * 0.08;
  const shipping_cost = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping_cost;

  // Process payment
  const paymentResult = await processStripePayment(payment, total);

  if (!paymentResult.success) {
    throw new Error(paymentResult.error || 'Payment failed');
  }

  // Create order object
  const order: OrderData = {
    orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    items: cart.items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price,
      quantity: item.quantity,
    })),
    shipping,
    billing,
    payment: {
      last4: payment.cardNumber.replace(/\s/g, '').slice(-4),
      cardholderName: payment.cardholderName,
    },
    subtotal,
    tax,
    shipping_cost,
    total,
    createdAt: new Date().toISOString(),
    status: 'completed',
  };

  // In a real app, this would save to a database
  console.log('Order created:', order);

  return order;
};

// Get order by ID (mock)
export const getOrder = async (orderId: string): Promise<OrderData | null> => {
  // In a real app, this would fetch from a database
  // For now, return null as we don't persist orders
  return null;
};
