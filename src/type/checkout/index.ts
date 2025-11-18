export interface ShippingInfo {
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

export interface BillingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  sameAsShipping: boolean;
}

export interface PaymentInfo {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
}

export interface CheckoutData {
  shipping: ShippingInfo | null;
  billing: BillingInfo | null;
  payment: PaymentInfo | null;
  currentStep: number;
}

export interface CheckoutContextType {
  checkoutData: CheckoutData;
  updateShipping: (shipping: ShippingInfo) => void;
  updateBilling: (billing: BillingInfo) => void;
  updatePayment: (payment: PaymentInfo) => void;
  setCurrentStep: (step: number) => void;
  resetCheckout: () => void;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface OrderData {
  orderId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  shipping: ShippingInfo;
  billing: BillingInfo;
  payment: {
    last4: string;
    cardholderName: string;
  };
  total: number;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}
