import { SQL, sql } from 'drizzle-orm';
import {
  text,
  pgTable,
  integer,
  timestamp,
  customType,
  index,
} from 'drizzle-orm/pg-core';
import { users } from './user';

const tsvector = customType<{ data: unknown }>({
  dataType() {
    return 'tsvector';
  },
});

export const articles = pgTable(
  'articles',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    title: text('title').notNull(),
    paragraphs: text('paragraphs').array().notNull(),
    authorId: integer('author_id')
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp('created_at')
      .notNull()
      .default(sql`now()`),
    textTsvector: tsvector('text_tsvector').generatedAlwaysAs(
      (): SQL => sql`
        to_tsvector('english', ${articles.title})
      `,
    ),
  },
  (table) => {
    return {
      textTsvectorIndex: index('text_tsvector_index').using(
        'gin',
        table.textTsvector,
      ),
    };
  },
);
