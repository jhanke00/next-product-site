import React from 'react';
import Link from 'next/link';
export default async function ProductDetails({ params }: { params: Promise<{ product: any }> }) {
  const { product } = await params;
  return (
    <div>
      <div key={product}>
        <p>{product}</p>
      </div>
    </div>
  );
}
