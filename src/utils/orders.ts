import orders from '@/src/mock/small/orders.json';

export function hasPurchasedProduct(userId: string, productId: string): boolean {
  return (orders as any[]).some(
    (order) => order.user === userId && order.items?.some((item: any) => item.id === productId)
  );
}
