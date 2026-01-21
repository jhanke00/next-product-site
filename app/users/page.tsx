'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import UsersList from '@/src/utils/orders/users';

const PAGE_SIZE = 40;

export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const userData = UsersList();
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const usersData = userData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(userData.length / PAGE_SIZE);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <main className='flex min-h-screen flex-col'>
      <div
        style={{
          textAlign: 'left',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
        className='items-left p-4'
      >
        Users
      </div>
      <div
        style={{
          fontSize: '1.2rem',
          color: '#777',
          marginBottom: '10px',
        }}
        className='items-left p-4'
      >
        Select any user to get the corresponding order details
      </div>
      <div className='z-10 max-w-5xl w-full font-mono text-sm lg:flex items-center p-8'>
        <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-4 items-center'>
          {usersData.map((user) => (
            <div
              key={user.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <Link href={`/users/${user.id}`}>
                <ul>
                  <li>
                    <p style={{ fontSize: '1.2rem', flexGrow: '1' }}>{user.firstName} {user.lastName}</p>
                  </li>
                </ul>

              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-around w-full border-t-2 pt-4'>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </main>
  );
}
