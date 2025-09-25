import { paginateResults } from '@utils/pagination';

describe('paginateResults', () => {
  const testData = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));

  it('should return the correct page of data', () => {
    const result = paginateResults(testData, 2, 10);
    expect(result.data).toHaveLength(10);
    expect(result.data[0]).toEqual({ id: 11 });
    expect(result.data[9]).toEqual({ id: 20 });
  });

  it('should return correct pagination metadata', () => {
    const result = paginateResults(testData, 2, 10);
    expect(result.currentPage).toBe(2);
    expect(result.totalPages).toBe(10);
    expect(result.totalItems).toBe(100);
  });

  it('should handle the first page correctly', () => {
    const result = paginateResults(testData, 1, 10);
    expect(result.data[0]).toEqual({ id: 1 });
    expect(result.currentPage).toBe(1);
  });

  it('should handle the last page correctly', () => {
    const result = paginateResults(testData, 10, 10);
    expect(result.data).toHaveLength(10);
    expect(result.data[9]).toEqual({ id: 100 });
  });

  it('should return an empty array for pages beyond the last page', () => {
    const result = paginateResults(testData, 11, 10);
    expect(result.data).toHaveLength(0);
    expect(result.currentPage).toBe(11);
    expect(result.totalPages).toBe(10);
  });

  it('should handle a page size larger than the dataset', () => {
    const result = paginateResults(testData, 1, 150);
    expect(result.data).toHaveLength(100);
    expect(result.totalPages).toBe(1);
  });

  it('should handle empty input array', () => {
    const result = paginateResults([], 1, 10);
    expect(result.data).toHaveLength(0);
    expect(result.totalPages).toBe(0);
    expect(result.totalItems).toBe(0);
  });

  it('should handle non-integer page and limit values', () => {
    const result = paginateResults(testData, 2.7, 10.3);
    expect(result.data).toHaveLength(10);
    expect(result.currentPage).toBe(2.7);
    expect(result.totalPages).toBe(10);
  });
});
