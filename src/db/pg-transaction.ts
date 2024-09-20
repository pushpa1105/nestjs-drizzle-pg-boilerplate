import { PgTransaction } from 'drizzle-orm/pg-core';
import { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import { ExtractTablesWithRelations } from 'drizzle-orm';
import { databaseSchema } from './schemas';

export type PostgresTransaction = PgTransaction<
  NodePgQueryResultHKT,
  typeof databaseSchema,
  ExtractTablesWithRelations<typeof databaseSchema>
>;
