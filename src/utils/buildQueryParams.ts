import { RangeOfValues } from '@type/products';

/**
 * Constructs a URLSearchParams object based on the given query data and returns it.
 *
 * @param {Record<string, any>} queryData - The query data used to construct the URLSearchParams object.
 * @returns {URLSearchParams} - The constructed URLSearchParams object.
 */
export const buildQueryParams = (queryData: Record<string, any>): URLSearchParams => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(queryData)) {
    params.append(key, encodeURIComponent(value.toString()));
  }

  return params;
};

export const parseNumberRange = (range: string | null): RangeOfValues<number> | null => {
  if (!range) {
    return null;
  }

  const [min, max] = range.split('-').map((value) => parseFloat(value));
  const minNotNaN = !isNaN(min);
  const maxNotNaN = !isNaN(max);

  if (!minNotNaN && !maxNotNaN) {
    return null;
  }

  return {
    ...(minNotNaN && { from: min }),
    ...(maxNotNaN && { to: max }),
  };
};
