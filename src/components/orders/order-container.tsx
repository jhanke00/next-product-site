import useOrders from '@/src/utils/orders/useOrders';
import useUserInfo from '@/src/utils/orders/useUserInfo';
import React from 'react';
import UserInfo from './user-info';
import OrderList from './order-list';

const OrdersContainer = () => {
  const { orderList, totalAmount } = useOrders();
  const { userInfo } = useUserInfo();

  return (
    <div className='flex flex-col p-8'>
      {userInfo && <UserInfo userDetails={userInfo} />}
      {orderList && <OrderList orderList={orderList} />}
      <div className='p-8'>
        <h3 className='text-2xl text-center'>Total Spent: {totalAmount}</h3>
      </div>
    </div>
  );
};

export default OrdersContainer;
