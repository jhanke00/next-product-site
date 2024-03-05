'use client';
import type { useReducer } from 'react';
import ListContactMessages from '../../src/components/ListContactMessages';
import '../../app/globals.css';
import Head from 'next/head';
const messages = JSON.parse(localStorage.getItem('messages')) || [];

const Contact = () => {
  return (
    <>
      <Head>
        <title>User able to contact us and share the feedback</title>
      </Head>
      <main className='lg:w-2/3 md:w-3/4 sm:w-full mx-auto md:mt-10 relative'>
        <div className='m-auto bg-cyan-50 pt-20 pb-20 overflow-hidden'>
          <ListContactMessages messages={messages} />
        </div>
      </main>
    </>
  );
};

export default Contact;
