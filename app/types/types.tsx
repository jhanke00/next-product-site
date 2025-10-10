export interface items {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  numReviews: number;
  rating: number;
  countInStock: number;
  // quantity: number;
  }

  export interface ShippingInfo {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
  }
  
  export interface PaymentInfo {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }