import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';
import { categories, articles } from '..';

export const categoriesArticles = pgTable(
  'categories_articles',
  {
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id),
    articleId: integer('article_id')
      .notNull()
      .references(() => articles.id),
  },
  (columns) => ({
    pk: primaryKey({ columns: [columns.categoryId, columns.articleId] }),
  }),
);
