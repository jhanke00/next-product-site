'use client';
import type { useReducer } from 'react';
import CreateContactFrom from '../../src/components/CreateContactForm';
import '../../app/globals.css';
import Head from 'next/head';

const Contact = () => {
  return (
    <>
      <Head>
        <title>Contact form | User able to contact us</title>
      </Head>
      <main className='lg:w-2/3 md:w-3/4 sm:w-full mx-auto md:mt-10 relative'>
        <div className='m-auto bg-cyan-50 pt-20 pb-20 overflow-hidden'>
          <CreateContactFrom />
        </div>
      </main>
    </>
  );
};

export default Contact;
