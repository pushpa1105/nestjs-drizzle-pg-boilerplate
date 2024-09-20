import { sql } from 'drizzle-orm';
import { pgTable, integer, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { addresses } from './addresses';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  password: text('password'),
  addressId: integer('address-id')
    .unique()
    .references(() => addresses.id),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
});
