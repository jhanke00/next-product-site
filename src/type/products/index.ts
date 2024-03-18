export interface ProductType {
  [key: string]: string | number;
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
}

export interface ProductTablePropsType {
  products: ProductType[];
  headers: HeaderType[];
  redirectUrl?: string | null;
}

export interface HeaderType {
  display: string;
  field: string;
  sortEnabled: boolean;
  valueType: string;
  addon: { subfield: string }[];
}

export interface ProductCardProps {
  product: ProductType;
}

export interface ProductPageConfig {
  rowCount: number;
  redirectUrl: string;
}
