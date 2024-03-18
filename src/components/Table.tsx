import React from 'react';
import Link from 'next/link';
import type { ProductType, ProductTablePropsType, HeaderType } from '@type/products';
import { roundNumber } from '@utils/common';
import { getAddonProductValue } from '@utils/productUtils';

const Table: React.FC<ProductTablePropsType> = ({ products, headers, redirectUrl }) => {
  return (
    <div className='overflow-x-auto'>
      <div className='bg-gray-800 text-white py-4 px-4 grid grid-cols-5 border-b border-gray-300'>
        {headers.map((header: HeaderType, index: number) => (
          <div key={index} className='text-lg font-semibold'>
            {header.display}
          </div>
        ))}
      </div>
      <div className='bg-white divide-y divide-gray-200'>
        {products.length === 0 ? (
          <div className='text-center py-4 text-gray-500'>No results found</div>
        ) : (
          products.map((product: ProductType, productIndex: number) => (
            <Link key={product.id} href={`${redirectUrl}/${product.id}`} passHref>
              <div className='app-table-row grid grid-cols-5'>
                {headers.map((header: HeaderType, headerIndex: number) => (
                  <div key={headerIndex} className='text-lg'>
                    {header.valueType === 'currency' ? `$` : ''}
                    {typeof product[header.field] === 'number' && Number.isFinite(product[header.field])
                      ? roundNumber(product[header.field] as number)
                      : product[header.field]}
                    {header.addon &&
                      header.addon.length > 0 &&
                      getAddonProductValue(product, header.addon) !== null && (
                        <span className='font-semibold'> - {getAddonProductValue(product, header.addon)} </span>
                      )}
                  </div>
                ))}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Table;
