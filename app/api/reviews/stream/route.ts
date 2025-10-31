import { NextResponse } from 'next/server';
import { subscribe } from '@/src/utils/reviews';

export const dynamic = 'force-dynamic';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  if (!productId) {
    return new NextResponse('productId required', { status: 400, headers: CORS_HEADERS });
  }

  const stream = new ReadableStream({
    start(controller) {
      // Write initial headers for SSE
      controller.enqueue(new TextEncoder().encode(`:ok\n\n`));
      const unsubscribe = subscribe(productId, (evt) => {
        const data = JSON.stringify(evt);
        controller.enqueue(new TextEncoder().encode(`event: ${evt.type}\n`));
        controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
      });
      (controller as any).unsubscribe = unsubscribe;
    },
    cancel() {
      const unsubscribe = (this as any).unsubscribe as (() => void) | undefined;
      unsubscribe?.();
    },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
