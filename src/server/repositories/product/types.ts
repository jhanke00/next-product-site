import { productsTable } from './product.schema';

export type ProductSelect = typeof productsTable.$inferSelect;
export type ProductInsert = typeof productsTable.$inferSelect;
