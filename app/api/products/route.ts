import { NextRequest, NextResponse } from 'next/server';
import { ProductListPageOptions, ProductListDbQueryData } from '@type/products';
import { getProductsList } from '@utils/products';
import { parseNumberRange } from '@utils/buildQueryParams';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageNumber = Number(searchParams.get('page'));
  const limit = Number(searchParams.get('limit'));
  const search = searchParams.get('search');
  const categoryFilter = searchParams.get('category');
  const priceRange = parseNumberRange(searchParams.get('price'));
  const ratingRange = parseNumberRange(searchParams.get('rating'));

  const filterOptions: ProductListDbQueryData = {
    ...(search && { search }),
    ...(categoryFilter && { category: categoryFilter }),
    ...(priceRange && { price: priceRange }),
    ...(ratingRange && { rating: ratingRange }),
  };

  const pageOptions: ProductListPageOptions = {
    page: pageNumber && Number.isInteger(pageNumber) ? pageNumber : 1,
    limit: limit && Number.isInteger(limit) ? limit : 20,
  };

  const result = await getProductsList(pageOptions, filterOptions);

  return NextResponse.json(result);
}
