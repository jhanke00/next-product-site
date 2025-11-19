export interface CartDisplayProps {
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onCheckout: () => void;
}

export interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}
