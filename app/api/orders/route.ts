import { NextResponse } from 'next/server';
import { validateOrder } from '@utils/orders/validateOrders';

export async function GET() {
  return NextResponse.json([
    { id: 1, name: 'Mock Product A' },
    { id: 2, name: 'Mock Product B' },
  ]);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = validateOrder(body);

    /* need to write a data cretion logic here */

    return NextResponse.json({ success: true, order: validated }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Invalid order input', details: error.errors ?? error.message }, { status: 400 });
  }
}
