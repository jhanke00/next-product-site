import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { NextRequest, NextResponse } from 'next/server';

import prisma from '@prisma';
import { Product } from '@type/products';

export async function GET(request: NextRequest, context: { params: { productId: string } }) {
  const id = context.params.productId;

  try {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return NextResponse.json(ReasonPhrases.NOT_FOUND, { status: StatusCodes.NOT_FOUND });
    }

    const { price, ...data } = product;

    return NextResponse.json<Product>({ ...data, price: price.toFixed(2) });
  } catch (error) {
    console.error(error);

    return NextResponse.json(ReasonPhrases.INTERNAL_SERVER_ERROR, { status: StatusCodes.INTERNAL_SERVER_ERROR });
  }
}
