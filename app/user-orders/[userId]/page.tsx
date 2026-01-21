'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/src/components/user-orders/card/card';
import { Item, UserOrdersProps } from '@/src/type/orders';
import { OrderSummary } from '@/src/components/user-orders/order-summary/order-summary';

import orders from '../../../src/mock/small/orders.json';
import users from '../../../src/mock/small/users.json';

export default function UserOrders({ params }: UserOrdersProps) {
  const [userOrders, setUserOrders] = useState([] as Item[]);
  const [userData, setUserData] = useState({ firstName: '', lastName: '' });

  useEffect(() => {
    const filteredUserOrders = orders.filter(({ user }) => user.toLowerCase() === params.userId.toLowerCase());
    const filteredUserData = users.find((user) => user.id.toLowerCase() === params.userId.toLowerCase());

    const itemDictionary = filteredUserOrders
      .flatMap(({ items }) => items)
      .reduce((dictionary: any, item) => {
        const { id } = item;
        dictionary[id] = dictionary[id] ? { ...dictionary[id], count: dictionary[id].count + item.count } : { ...item };
        return dictionary;
      }, {});

    const ordersList: Item[] = Object.values(itemDictionary);
    setUserOrders(ordersList);
    setUserData(filteredUserData || { firstName: '', lastName: '' });
  }, [params?.userId]);

  return (
    <div>
      <section className='py-24 relative'>
        <h2 className='font-bold pb-6 pl-14 text-2xl leading-8 text-white mb-3'>Your Orders</h2>
        <h2 className='font-medium pl-14 pb-6 text-xl leading-8 text-white mb-3'>
          Hi, {`${userData.firstName} ${userData.lastName}`}
        </h2>
        <div className='w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto'>
          <div className='flex items-start flex-col gap-6 xl:flex-row '>
            <div className='w-full max-w-sm md:max-w-3xl max-xl:mx-auto overflow-auto h-[500px]'>
              <div className='grid grid-cols-1 gap-2'>
                {userOrders?.map((item: Item) => <Card key={item.id} data={item} />)}
              </div>
            </div>
            <div className='w-full max-w-sm md:max-w-3xl xl:max-w-sm flex items-start flex-col gap-8 max-xl:mx-auto'>
              <OrderSummary data={userOrders} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
