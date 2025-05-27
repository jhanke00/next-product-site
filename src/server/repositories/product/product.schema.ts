import { numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const productsTable = pgTable('products', {
  id: uuid()
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  name: text().notNull(),
  price: numeric<'number'>().notNull(),
  description: text().notNull(),
  category: text().notNull(),
  rating: numeric<'number'>().notNull(),
  numReviews: numeric<'number'>().notNull(),
  countInStock: numeric<'number'>().notNull(),
});
