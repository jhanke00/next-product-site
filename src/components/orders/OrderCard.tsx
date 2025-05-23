import { Order } from '@/src/type/orders';
import { formatDate } from '@/src/utils/date';

interface Props {
  order: Order;
}

const OrderCard = ({ order }: Props) => (
  <div className='bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow mb-5'>
    <div className='flex items-center justify-between mb-3'>
      <span className='text-base font-semibold'>{formatDate(order.time)}</span>
      <span className='text-base font-bold text-green-700 dark:text-green-400'>Total: ${order.total}</span>
    </div>
    <div className='flex flex-wrap gap-4'>
      {order.items?.map((item) => (
        <div
          key={item.id}
          className='flex flex-col bg-gray-100 dark:bg-gray-700 rounded-lg p-4 min-w-[180px] max-w-xs flex-1 border border-gray-200 dark:border-gray-600'
        >
          <p className='font-medium text-gray-900 dark:text-gray-100 mb-1'>{item.name}</p>
          <p className='text-gray-600 dark:text-gray-400 text-sm mb-0.5'>Price: ${item.price}</p>
          <p className='text-gray-600 dark:text-gray-400 text-sm'>Quantity: {item.count}</p>
        </div>
      ))}
    </div>
  </div>
);

export default OrderCard;
