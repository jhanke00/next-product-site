import { reviewsTable } from './review.schema';

export type ReviewSelect = typeof reviewsTable.$inferSelect;
export type ReviewInsert = typeof reviewsTable.$inferInsert;
