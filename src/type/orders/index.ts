export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  category: string;
  image?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'cod'; // Cash on Delivery only
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  orderNumber: string;
}

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  agreedToTerms: boolean;
}

export interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber' | 'status'>) => Promise<Order>;
  getOrder: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}
