'use client';

import { OrderDetails } from '@/src/components/OrderDetails';
import { useEffect, useState } from 'react';
import UsersList from '@/src/utils/orders/users';
import OrdersList from '@/src/utils/orders/orders';

const userOrders = ({ params }: { params: { userId: string } }) => {

  const [orderedItemsList, setOrderedItemsList] = useState<any>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [userName, setUserName] = useState("");
  const [loader, setLoader] = useState(true);
  const userData = UsersList();
  const orderData = OrdersList();

  useEffect(() => {
    const orders = orderData.filter(item => item.user === params.userId);
    const filteredUser:any = userData.find(user => user.id === params.userId);
    const orderedItems = orders.map((order: any) => {
      return order.items;
    }).flat();
    const totalExpenditure = orders.reduce((sum: any, order: any) => sum + order.total, 0);
    setOrderedItemsList(orderedItems);
    setTotalExpense(totalExpenditure);
    filteredUser && setUserName(filteredUser.firstName + " " + filteredUser.lastName);
    setLoader(false);
  }, [params.userId]);


  return (
    <div className='flex min-h-screen flex-col p-8 item-center'>
      <h1 className='text-2xl font-semibold items-center'>Order Details - {userName}</h1>
      {loader && <p>Loading Orders..Please wait!</p>}
      {
        !loader && orderedItemsList.length === 0 ? <p>No Orders Yet!</p>
          :
          !loader &&
          <>
            <div>
              <div className='flex flex-1 flex-row justify-around'>
                <h2 className="text-right flex flex-1 flex-col p-4" style={{ paddingLeft: "10%" }}>Order Total</h2>
                <div className='text-right flex flex-1 flex-col font-semibold'>
                  <p className='font-semibold'>Total Spent: {totalExpense}</p>
                </div>
              </div>
              <h3 className={`mb-3 text-xl `}>
                {
                  orderedItemsList.map((item: any) => {
                    return <OrderDetails data={item} />
                  })
                }
              </h3>
            </div>
          </>
      }
    </div>
  );
};

export default userOrders;
