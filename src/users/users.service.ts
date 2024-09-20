import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DrizzleService } from 'src/db/drizzle.service';
import { PgErrorCode } from 'src/db/utils/pg-code.enum';
import { UserAlreadyExistsException } from './exceptions/user-exists.exception';
import { isRecord } from 'src/utils/is-record';
import { eq } from 'drizzle-orm';
import { databaseSchema } from 'src/db/schemas';
import { PostgresTransaction } from 'src/db/pg-transaction';
import { isDatabaseError } from 'src/db/utils/db-error';

@Injectable()
export class UsersService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async createWithAddress(user: CreateUserDto) {
    return this.drizzleService.db.transaction(async (transaction) => {
      const createdAddresses = await transaction
        .insert(databaseSchema.addresses)
        .values(user.address)
        .returning();

      const address = createdAddresses.pop();
      const userWithAddressId = {
        name: user.name,
        email: user.email,
        password: user.password,
        addressId: address.id,
      };

      try {
        const createdUsers = await transaction
          .insert(databaseSchema.users)
          .values(userWithAddressId)
          .returning();
        return createdUsers.pop();
      } catch (error) {
        if (isRecord(error) && error.code === PgErrorCode.UNIQUE_VIOLATION) {
          throw new UserAlreadyExistsException(user.email);
        }
        throw error;
      }
    });
  }

  async getByEmail(email: string) {
    const user = await this.drizzleService.db.query.users.findFirst({
      with: {
        address: true,
      },
      where: eq(databaseSchema.users.email, email),
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async getById(userId: number) {
    const user = await this.drizzleService.db.query.users.findFirst({
      with: {
        address: true,
      },
      where: eq(databaseSchema.users.id, userId),
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async delete(userId: number, transaction?: PostgresTransaction) {
    const db = transaction ?? this.drizzleService.db;
    try {
      // return this.drizzleService.db.transaction(async (transaction) => {
      //   await transaction
      //     .delete(databaseSchema.articles)
      //     .where(eq(databaseSchema.articles.authorId, userId));
      // });
      const deletedUsers = await db
        .delete(databaseSchema.users)
        .where(eq(databaseSchema.users.id, userId))
        .returning();

      if (deletedUsers.length === 0) throw new NotFoundException();
    } catch (error) {
      if (
        isDatabaseError(error) &&
        error.code === PgErrorCode.FOREIGN_KEY_VIOLATION
      ) {
        throw new BadRequestException(
          'Can not remove a user that is an author of an article',
        );
      }
      throw error;
    }
  }

  async deleteWithArticles(userId: number) {
    try {
      return this.drizzleService.db.transaction(async (transaction) => {
        await transaction
          .delete(databaseSchema.articles)
          .where(eq(databaseSchema.articles.authorId, userId));

        await this.delete(userId, transaction);
      });
    } catch (error) {
      throw error;
    }
  }
}
