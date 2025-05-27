export type Nullish = null | undefined;

export const isNullish = (value: unknown): value is Nullish => {
  return value === null || value === undefined;
};
