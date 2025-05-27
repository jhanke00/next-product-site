import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: uuid()
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  phoneNumber: text().notNull().unique(),
  email: text().notNull().unique(),
});
