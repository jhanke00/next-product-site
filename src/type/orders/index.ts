export type Item = {
    id: string;
    name: string;
    price: number;
    count: number;
}

export type Order = {
    user: string;
    items: Array<Item>,
    total: number;
    time: Date;
  };