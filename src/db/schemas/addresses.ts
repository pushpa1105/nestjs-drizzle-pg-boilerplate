import { text, pgTable, serial } from 'drizzle-orm/pg-core';

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  street: text('street'),
  city: text('city'),
  country: text('country'),
});
