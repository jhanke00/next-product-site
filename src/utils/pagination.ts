export function paginateResults<T>(results: T[], page: number, limit: number) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedData = results.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    currentPage: page,
    totalPages: Math.ceil(results.length / limit),
    totalItems: results.length,
  };
}
