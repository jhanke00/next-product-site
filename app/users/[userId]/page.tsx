import Link from 'next/link';

import { getOrders } from '@/src/utils/orders/get-orders';
import { getUsers } from '@/src/utils/users/get-users';
import BackToTop from '@/src/components/BackToTop';
import OrderCard from '@/src/components/orders/OrderCard';
import { Order } from '@/src/type/orders';
import { User } from '@/src/type/users';

interface UserOrderData {
  orders: Order[];
  user: User | undefined;
  totalAmount: number;
}

interface Props {
  params: { userId: string };
}

const getUserOrderData = (userId: string): UserOrderData => {
  const orders = getOrders().filter((item) => item.user === userId);
  const user = getUsers().find((user) => user.id === userId);
  const totalAmount = orders.reduce((total, order) => total + order.total, 0);
  return { orders, user, totalAmount };
};

const UserInfo = ({ params }: Props) => {
  const { orders, user, totalAmount } = getUserOrderData(params.userId);

  if (!user) {
    return <p className='text-3xl font-bold mt-10'>User not Found</p>;
  }

  return (
    <div className='max-w-5xl w-full items-center justify-between font-mono text-sm'>
      <h2 className='text-3xl font-bold text-gray-700 dark:text-gray-300 mb-2'>
        User:
        <span className='ml-2 text-gray-900 dark:text-white'>{user.firstName + ' ' + user.lastName}</span>
      </h2>

      <p className='text-sm opacity-50'>Phone: {user.phoneNumber}</p>
      <p className='text-sm opacity-50'>Email: {user.email}</p>

      <h3 className='text-lg font-semibold text-gray-700 dark:text-gray-300 mb-5'>
        Total Amount Spent: <span className='text-green-700 dark:text-green-400'>${totalAmount}</span>
      </h3>

      {orders.map((order, index) => (
        <OrderCard key={index} order={order} />
      ))}

      <Link
        href='/users/'
        className='text-white bg-gray-700 hover:bg-gray-900 font-semibold rounded-lg text-base px-5 py-2.5 transition-colors'
        title='Back to Users page'
      >
        ← Back to Users
      </Link>

      <BackToTop />
    </div>
  );
};

export default UserInfo;
