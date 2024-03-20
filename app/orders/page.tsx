'use client';
import largeOrdersData from '@mock/small/orders.json';
import largeUsersData from '@mock/small/users.json';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const PAGE_SIZE = 20;

export default function Orders() {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersData = [...largeOrdersData];
  const usersData = [...largeUsersData];
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const orders = ordersData.slice(startIndex, endIndex);
  const users = usersData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(ordersData.length / PAGE_SIZE);
  const [filteredOrders, setFilteredOrders] = useState(ordersData);
  const [searchString, setSearchString] = useState('');

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const calculateTotalPrice = (order) => {
    return order.items.reduce((total, item) => total + parseFloat(item.price * item.count), 0);
  };

  const joinedData = orders.reduce((acc, order) => {
    // Find the user corresponding to the user ID in the order
    const user = users.find((user) => user.id === order.user);

    // If user is found, add the order with user information to the accumulator
    if (user) {
      acc.push({ ...order, user });
    }

    return acc;
  }, []);

  const handleSearch = () => {
    const filtered = joinedData.filter(
      (order) =>
        order.user.firstName.toLowerCase().trim().includes(searchString.toLowerCase().trim()) ||
        order.user.lastName.toLowerCase().trim().includes(searchString.toLowerCase().trim()) ||
        (order.user.firstName + ' ' + order.user.lastName)
          .toLowerCase()
          .trim()
          .includes(searchString.toLowerCase().trim())
    );
    setFilteredOrders(filtered);
  };

  const handleChange = (event) => {
    setSearchString(event.target.value);
  };

  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <input
        type='text'
        value={searchString} // Bind the input value to the state
        onChange={handleChange} // Handle changes in the input field
        placeholder='Input user name'
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {filteredOrders.map((order, index) => (
          <div
            key={index}
            className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
          >
            <p className={`m-0 max-w-[50ch] text-sm opacity-50`}>
              User: {order.user.firstName} {order.user.lastName}
            </p>
            <p className={`m-0 max-w-[50ch] text-sm opacity-50`}>Total: ${order.total}</p>
            <p className={`m-0 max-w-[50ch] text-sm opacity-50`}>Time: {order.time}</p>
            <ul>
              {order.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <p className={`m-0 max-w-[50ch] text-sm opacity-50`}>Name: {item.name}</p>
                  <p className={`m-0 max-w-[50ch] text-sm opacity-50`}>Price: ${item.price}</p>
                  <p className={`m-0 max-w-[50ch] text-sm opacity-50`}>Count: {item.count}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
        <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left'>
          {joinedData
            .map((data, index) => (
              <div
                key={index}
                className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
              >
                <p className={`m-0 max-w-[50ch] text-sm opacity-50`}>
                  User : {data.user.firstName} {data.user.lastName}
                </p>
                <p className={`m-0 max-w-[50ch] text-sm opacity-50`}>User : {data.user.email}</p>
                <ul>
                  {data.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <p className={`m-0 max-w-[50ch] text-sm opacity-50`}>Item name : {item.name}</p>
                      <p className={`m-0 max-w-[50ch] text-sm opacity-50`}>Item price : {item.price}</p>
                      <p className={`m-0 max-w-[50ch] text-sm opacity-50`}>Item count : {item.count}</p>
                    </li>
                  ))}
                </ul>
                <p>Total: ${calculateTotalPrice(data)}</p>
              </div>
            ))
            .sort((a, b) => a.firstName - b.firstName)}
        </div>
      </div>
    </main>
  );
}
