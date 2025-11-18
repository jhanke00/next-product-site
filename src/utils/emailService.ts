import { OrderData } from '@/src/type/checkout';

// Mock email service
export const sendOrderConfirmationEmail = async (order: OrderData): Promise<boolean> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, this would integrate with an email service like SendGrid, AWS SES, etc.
  console.log('Sending order confirmation email to:', order.shipping.email);
  console.log('Order ID:', order.orderId);
  console.log('Total:', order.total);

  // Mock email content
  const emailContent = `
    Dear ${order.shipping.firstName} ${order.shipping.lastName},

    Thank you for your order!

    Order ID: ${order.orderId}
    Order Date: ${new Date(order.createdAt).toLocaleDateString()}

    Items:
    ${order.items.map((item) => `- ${item.name} x ${item.quantity}: $${(item.price * item.quantity).toFixed(2)}`).join('\n    ')}

    Subtotal: $${order.subtotal.toFixed(2)}
    Tax: $${order.tax.toFixed(2)}
    Shipping: ${order.shipping_cost === 0 ? 'FREE' : `$${order.shipping_cost.toFixed(2)}`}
    Total: $${order.total.toFixed(2)}

    Shipping Address:
    ${order.shipping.firstName} ${order.shipping.lastName}
    ${order.shipping.address}
    ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}
    ${order.shipping.country}

    We'll send you a shipping confirmation email when your order ships.

    Thank you for shopping with us!
  `;

  console.log('Email content:', emailContent);

  return true;
};

// Mock shipping notification email
export const sendShippingNotificationEmail = async (
  email: string,
  orderId: string,
  trackingNumber: string
): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Sending shipping notification email to:', email);
  console.log('Order ID:', orderId);
  console.log('Tracking Number:', trackingNumber);

  return true;
};
