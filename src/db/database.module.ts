import { Global, Module } from '@nestjs/common';
import {
  ConfigurableDatabaseModule,
  CONNECTION_POOL,
  DATABASE_OPTIONS,
} from './db.module-definition';
import { Pool } from 'pg';
import { DrizzleService } from './drizzle.service';
import { DatabaseOptions } from './interfaces/db.interfaces';

@Global()
@Module({
  exports: [DrizzleService],
  providers: [
    DrizzleService,
    {
      provide: CONNECTION_POOL,
      inject: [DATABASE_OPTIONS],
      useFactory: (databaseOptions: DatabaseOptions) => {
        return new Pool({
          host: databaseOptions.host,
          port: databaseOptions.port,
          user: databaseOptions.user,
          password: databaseOptions.password,
          database: databaseOptions.database,
          ssl: { rejectUnauthorized: false },
        });
      },
    },
  ],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
