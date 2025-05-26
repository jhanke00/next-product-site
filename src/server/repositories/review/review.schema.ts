import { index, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { usersTable } from '@/src/server/repositories/user/user.schema';
import { productsTable } from '@/src/server/repositories/product/product.schema';

export const reviewsTable = pgTable(
  'reviews',
  {
    id: uuid()
      .$defaultFn(() => crypto.randomUUID())
      .primaryKey(),
    user: uuid()
      .references(() => usersTable.id, { onDelete: 'cascade', onUpdate: 'cascade' })
      .notNull(),
    product: uuid()
      .references(() => productsTable.id, { onDelete: 'cascade', onUpdate: 'cascade' })
      .notNull(),
    rating: numeric<'number'>(),
    review: text(),
    createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
  },
  (self) => [
    index('user_idx').on(self.user),
    index('product_idx').on(self.product),
    index('rating_idx').on(self.rating),
  ]
);

export const reviewsRelations = relations(reviewsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [reviewsTable.user],
    references: [usersTable.id],
  }),
  product: one(productsTable, {
    fields: [reviewsTable.product],
    references: [productsTable.id],
  }),
}));

export const usersRelations = relations(usersTable, ({ many }) => ({
  reviews: many(reviewsTable),
}));

export const productRelations = relations(productsTable, ({ many }) => ({
  products: many(reviewsTable),
}));
