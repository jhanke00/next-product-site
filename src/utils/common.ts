import { useState } from 'react';

export function usePagination(initialPage: number = 1): [number, (pageNumber: number) => void] {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const getPageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return [currentPage, getPageChange];
}
export function getPageSliceData(items: any[], currentPage: number, itemsPerPage: number): any[] {
  const endIndex = currentPage * itemsPerPage;
  const startIndex = endIndex - itemsPerPage;
  return items.slice(startIndex, endIndex);
}

export function roundNumber(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
