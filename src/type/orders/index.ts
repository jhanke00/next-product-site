export type Item = {
  id: string;
  name: string;
  price: number | string;
  count: number;
};

export type Order = {
  user: string;
  items: Array<Item>;
  total: number;
  time: Date;
};

export type UserOrdersProps = {
  params: {
    userId: string;
  };
};

export type CardProps = {
  data: Item;
};

export type OrderSummaryProps = {
  data: Item[];
};
