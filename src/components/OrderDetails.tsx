import { OrderProps } from '@/src/type/orders';

export const OrderDetails = ({ data }: OrderProps) => {
  const { name, price, count, id } = data;

  return (
    <div className='rounded-3xl p-6 bg-black-100 border border-black-100 flex flex-col md:flex-row md:items-center gap-5 transition-all duration-500 hover:border-black-400'>
      <div className='grid grid-cols-2 md:grid-cols-2 w-full gap-3 md:gap-8 grid-flow-col'>

        <div className='flex flex-1 flex-row justify-around'>
          <div className='flex flex-1 flex-col '>
            <h2 className='text-black mb-3' style={{ fontSize: "1rem" }}>Order ID: {id}</h2>
            <p style={{ fontSize: '1rem' }}>Name: {name}</p>
            <p style={{ fontSize: '1rem' }}>Price: {price}</p>
            <p style={{ fontSize: '1rem' }}>Quantity Ordered: {count}</p>
          </div>

          <div className='flex flex-1 flex-col'>
            <p style={{ fontSize: '1rem' }}> {count * price}</p>
          </div>
        </div>
      </div>

    </div>
  );
};