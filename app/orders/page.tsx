'use client';
import React from 'react';
import Breadcrumbs from '@components/Breadcrumbs';
import { OrderBreadcrumbs } from '@utils/breadcrumbsUtils';
import ErrorPage from '@components/ErrorPage';

const ProductDetailsPage = () => {
  return (
    <main className='flex flex-col items-left p-4'>
      <Breadcrumbs breadcrumbs={OrderBreadcrumbs} />
      <ErrorPage message={`This page could not be found`} page='Orders' eType='404' />
    </main>
  );
};

export default ProductDetailsPage;
