import type { Product } from '@type/products';

const Products = () => {
  const products: Array<Product> = [
    {
      id: 1,
      name: 'Product 1',
      price: 100,
      description: 'This is a product',
      category: 'Category 1',
      rating: 4.5,
      numReviews: 10,
      countInStock: 6,
    },
    {
      id: 2,
      name: 'Product 2',
      price: 200,
      description: 'This is a product',
      category: 'Category 2',
      rating: 4.0,
      numReviews: 10,
      countInStock: 6,
    },
    {
      id: 3,
      name: 'Product 3',
      price: 300,
      description: 'This is a product',
      category: 'Category 3',
      rating: 3.5,
      numReviews: 10,
      countInStock: 6,
    },
    {
      id: 4,
      name: 'Product 4',
      price: 400,
      description: 'This is a product',
      category: 'Category 4',
      rating: 3.0,
      numReviews: 10,
      countInStock: 6,
    },
    {
      id: 5,
      name: 'Product 5',
      price: 500,
      description: 'This is a product',
      category: 'Category 5',
      rating: 2.5,
      numReviews: 10,
      countInStock: 6,
    },
  ];

  return (
    <main className='flex min-h-screen flex-col items-center  p-24'>
      <h1 className='text-3xl fixed left-0 top-0 flex w-full justify-center'>Products</h1>
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
        <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left'>
          {products.map((product) => (
            <div
              key={product.id}
              className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
            >
              <h3 className={`mb-3 text-2xl font-semibold`}>{product.name}</h3>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Price: {product.price}</p>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Description: {product.description}</p>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Category: {product.category}</p>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Rating: {product.rating}</p>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Reviews: {product.numReviews}</p>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Stock: {product.countInStock}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Product;
