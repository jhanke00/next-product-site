'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/src/components/user-orders/card/card';
import { Item, UserOrdersProps } from '@/src/type/orders';
import { OrderSummary } from '@/src/components/user-orders/order-summary/order-summary';

import orders from '../../../src/mock/small/orders.json';

export default function UserOrders({ params }: UserOrdersProps) {
  const [userOrders, setUserOrders] = useState([] as Item[]);

  useEffect(() => {
    const userOrders = orders.filter(({ user }) => user.toLowerCase() === params.userId.toLowerCase());

    const itemDictionary = userOrders
      .flatMap(({ items }) => items)
      .reduce((dictionary: any, item) => {
        const { id } = item;
        dictionary[id] = dictionary[id] ? { ...dictionary[id], count: dictionary[id].count + item.count } : { ...item };
        return dictionary;
      }, {});

    const ordersList = Object.values(itemDictionary);
    setUserOrders(ordersList as Item[]);
  }, [params?.userId]);

  return (
    <div>
      <section className='py-24 relative'>
        <h2 className='w-full pb-6 pl-14'>UserId: {params.userId}</h2>
        <div className='w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto'>
          <div className='flex items-start flex-col gap-6 xl:flex-row '>
            <div className='w-full max-w-sm md:max-w-3xl max-xl:mx-auto'>
              <div className='grid grid-cols-1 gap-6'>
                {userOrders?.map((item: Item) => <Card key={item.id} data={item} />)}
              </div>
            </div>
            <OrderSummary data={userOrders} />
          </div>
        </div>
      </section>
    </div>
  );
}
