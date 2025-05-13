import { z } from 'zod';

// Define the expected order input schema
export const OrderSchema = z.object({
  customerId: z.string().uuid(),
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ),
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    zip: z.string().min(5).max(10),
    country: z.string().min(1),
  }),
  paymentMethod: z.enum(['credit_card', 'paypal', 'cash_on_delivery']),
  notes: z.string().optional(),
});

// This function validates and returns typed data or throws an error
export function validateOrder(input: unknown) {
  return OrderSchema.parse(input);
}
