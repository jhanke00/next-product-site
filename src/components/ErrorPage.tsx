import React from 'react';
import type { ErrorPropsType } from '@type/common';

const ErrorPage: React.FC<ErrorPropsType> = ({ message, page, eType }) => {
  return (
    <div className='mt-8'>
      <h1 className='text-3xl text-red-800 font-semibold text-4xl mb-4'>
        {page} - {eType}
      </h1>
      <p className='text-gray-600 text-3xl'>{message}</p>
    </div>
  );
};

export default ErrorPage;
