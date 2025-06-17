import useSWR from 'swr';
import { Product } from '@type/products';
import { httpFetch } from '@utils/httpFetch';
import { buildQueryParams } from '@utils/buildQueryParams';
import { CustomResponse, Pagination } from '@type/common';
import { ProductQueryParams } from '@type/products';
import { removeEmptyProperties } from '@utils/removeEmptyProperties';

/**
 * Retrieves a list of products based on the provided query data.
 *
 * @param {ProductQueryData} productQueryData - The query data to filter the products.
 * @returns {CustomResponse<Product[]>} - An object containing the list of products, pagination information, loading state, and error state.
 *
 * @example
 * const queryData = {
 *   category: 'electronics',
 *   price: '100-500',
 * };
 *
 * const result = getProducts(queryData);
 * // result = {
 * //   products: [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }],
 * //   pagination: { pageCount: 2, totalCount: 50, page: 1 },
 * //   isLoading: false,
 * //   error: null
 * // }
 */
export const useFetchProducts = (productQueryData: ProductQueryParams): CustomResponse<Product[]> => {
  const params = buildQueryParams(removeEmptyProperties(productQueryData));

  const url = `/products?${params.toString()}`;
  const { data, isLoading, error } = useSWR<{ data: Product[]; pagination: Pagination }>(url, httpFetch);

  return {
    data: data?.data || [],
    pagination: data?.pagination || { pageCount: 0, totalCount: 0, page: 1 },
    isLoading,
    error,
  };
};
