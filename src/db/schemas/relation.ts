import { relations } from 'drizzle-orm';
import { categoriesArticles } from './relations/categories-articles';
import { addresses } from './addresses';
import { articles } from './articles';
import { categories } from './categories';
import { users } from './user';

export const usersAddressesRelation = relations(users, ({ one }) => ({
  address: one(addresses, {
    fields: [users.addressId],
    references: [addresses.id],
  }),
}));

export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
  categoriesArticles: many(categoriesArticles),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  categoriesArticles: many(categoriesArticles),
}));

export const categoriesArticlesRelations = relations(
  categoriesArticles,
  ({ one }) => ({
    category: one(categories, {
      fields: [categoriesArticles.categoryId],
      references: [categories.id],
    }),
    article: one(articles, {
      fields: [categoriesArticles.articleId],
      references: [articles.id],
    }),
  }),
);
