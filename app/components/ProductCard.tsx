type Product = {
  category: string;
  countInStock: number;
  description: string;
  id: number;
  name : string;
  numReviews : number;
  price : string;
  rating : number;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
}
