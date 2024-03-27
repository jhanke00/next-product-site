import { Item, Order } from '@/src/type/orders';
import React from 'react';

type PropsType = {
  orderList: Item[];
};

const OrderList = ({ orderList }: PropsType) => {
  return (
    <div className='flex flex-1 flex-col'>
      {orderList.map((order) => (
        <div className='flex flex-1 flex-col p-8'>
          <p className='text-2xl text-center p-8'>Product: {order.name}</p>
          <div className='flex justify-around'>
            <p>Order Id: {order.id}</p>
            <p>Price: {order.price}</p>
            <p>Quantity: {order.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
