import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { NextRequest, NextResponse } from 'next/server';

import prisma from '@prisma';
import { ProductsResponse } from '@type/products';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const offset = Number(searchParams.get('offset')) || 0;
  const limit = Number(searchParams.get('limit')) || 20;

  try {
    const [total, products] = await prisma.$transaction([
      prisma.product.count(),
      prisma.product.findMany({
        skip: offset,
        take: limit,
      }),
    ]);

    return NextResponse.json<ProductsResponse>({
      products: products.map(({ price, ...data }) => ({ ...data, price: price.toFixed(2) })),
      total,
      offset,
      limit,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(ReasonPhrases.INTERNAL_SERVER_ERROR, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}
