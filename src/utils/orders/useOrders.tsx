import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import orderData from '@mock/small/orders.json';
import productData from '@mock/small/products.json';
import { Item, Order } from '@/src/type/orders';

const useOrders = () => {
  const router = useRouter();
  const { userId } = router.query;

  const [orderList, setOrderList] = useState<Item[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>();

  useEffect(() => {
    let amountSpentByUser = 0;
    const userOrderList: any = orderData
      .filter((order) => order.user === userId)
      .map((filteredOrders) => {
        amountSpentByUser += filteredOrders.total;
        return filteredOrders.items;
      })
      .flat();
    setTotalAmount(amountSpentByUser);
    setOrderList(userOrderList);
  }, [userId]);

  return { orderList, totalAmount };
};

export default useOrders;
