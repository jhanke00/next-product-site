interface Address {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
interface CardForm {
  cardName?: string;
  cardNumber?: string;
  upiId?: string;
}

interface Payment {
  method: 'card' | 'upi';
  form?: CardForm;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutState {
  shipping: { shipping: Address } | null;
  payment: Payment | null;
  cart: { items: CartItem[] } | null;
}

export interface OrderConfirmationProps {
  shipping: { shipping: Address } | null;
  payment: Payment | null;
  cart: { items: CartItem[] } | null;
  onBack: () => void;
}

export interface PaymentFormProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

export interface BillingFormProps {
  form: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ShippingFormProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}
