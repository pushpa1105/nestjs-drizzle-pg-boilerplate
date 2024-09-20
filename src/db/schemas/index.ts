/**
 * On schema update, generate migration file & run it migrate to db.
 * Step 1: `npx drizzle-kit generate --name <migration-name>`
 * Step 2: `npx drizzle-kit migrate`
 */

import { addresses } from './addresses';
import { articles } from './articles';
import { categories } from './categories';
import {
  usersAddressesRelation,
  articlesRelations,
  categoriesRelations,
  categoriesArticlesRelations,
} from './relation';
import { categoriesArticles } from './relations/categories-articles';
import { users } from './user';

export const databaseSchema = {
  articles,
  categories,
  addresses,
  users,
  categoriesArticles,
  usersAddressesRelation,
  articlesRelations,
  categoriesRelations,
  categoriesArticlesRelations,
};

export { articles, addresses, users, categories };
