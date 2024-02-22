# Frontend

Documentation on any Frontend capabilities or changes made.

# Prodcuts Listing Page Module

Product Listing Page is one of the page offering a user-friendly interface, organized product display with Name, Price, Discount Price and Star Ratings. Developers can find related code, styling, and documentation in this section, contributing to an engaging shopping experience for users.
This page is containing Three reusable components (ProductCard, PriceTag and StarRating).

### Folder Structure

- `app/products/layout.tsx` - Layout for this module
- `app/products/page.tsx` - Main Page for this module
- `public/images` - Contains sample image used for this module
- `src/mock/small/products-new.json` - Mock JSON for Prodcut list

### Components

#### ProductCard

##### Folder Structure - `src/components/productCard.tsx`

##### Example Usage

```tsx
import ProductCard from '@/src/components/productCard';

// Use the FeatureComponent in your code
<ProductCard key={product.id} {...product} />;
```

StarRating

## Folder Structure - `src/components/starRating.tsx`

## Example Usage

```tsx
import StarRating from '@/src/components/starRating';

// Use the FeatureComponent in your code
<StartRating {...starRating} />;
```

PriceTag

## Folder Structure - `src/components/priceTag.tsx`

## Example Usage

```tsx
import PriceTag from '@/src/components/priceTag';

// Use the FeatureComponent in your code
<PriceTag {...productPrice} />;
```

## Types:

Product

## Folder Structure - `src/type/products`

## Example Usage

```tsx

import { Product } from '@/src/type/products';

// Use the FeatureComponent in your code

   const product: Product = {
    id: 1;
    name: 'Product Name';
    price: 100;
    description?: "Product Description";
    category?: 'Product Category';
    rating: 4.5;
    numReviews?: 100;
    countInStock?: 3;
    image: 'Product Image Path';
    originalPrice: 200;
   };

```

Price

## Folder Structure - `src/type/price`

## Example Usage

```tsx
import { Price } from '@/src/type/price';

// Use the FeatureComponent in your code

   const price: Price = {
    originalPrice: 100;
    price: 60;
    originalPriceStyle: 'text-sm';
    priceStyle: 'text-xl';
   };

```

StarRating

## Folder Structure - `src/type/price`

## Example Usage

```tsx
import { Rating } from '@/src/type/price';

// Use the FeatureComponent in your code

   const rating: Rating = {
    count: 4;
    width: 20;
    height: 20;
   };

```
