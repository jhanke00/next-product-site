export const pick = <T extends Record<string, unknown>, K extends keyof T>(obj: T, arr: K[]): Pick<T, K> => {
  if (arr.length === 0) {
    return obj;
  }

  return arr.reduce(
    (acc, record) => {
      if (record in obj) {
        acc[record] = obj[record];
      }
      return acc;
    },
    {} as Pick<T, K>
  );
};
