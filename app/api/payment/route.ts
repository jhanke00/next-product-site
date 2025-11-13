import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardNumber, amount } = body;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check for declined card
    if (cardNumber === '4000000000000002') {
      return NextResponse.json({ error: 'card_declined' }, { status: 402 });
    }

    // Successful payment
    const paymentId = `pay_${Date.now()}`;
    return NextResponse.json({
      success: true,
      paymentId,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
