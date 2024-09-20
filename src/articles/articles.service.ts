import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DrizzleService } from 'src/db/drizzle.service';
import { asc, count, eq, gt, SQL, sql } from 'drizzle-orm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PgErrorCode } from 'src/db/utils/pg-code.enum';
import { PaginationParamsDto } from 'src/utils/dto/pagination-params.dto';
import { databaseSchema } from 'src/db/schemas';
import { isDatabaseError } from 'src/db/utils/db-error';

@Injectable()
export class ArticlesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(article: CreateArticleDto, authorId: number) {
    try {
      return this.drizzleService.db.transaction(async (transaction) => {
        const createdArticles = await transaction
          .insert(databaseSchema.articles)
          .values({
            authorId,
            title: article.title,
            paragraphs: article.paragraphs,
          })
          .returning();

        const createdArticle = createdArticles.pop();

        await transaction.insert(databaseSchema.categoriesArticles).values(
          article.categoryIds.map((categoryId) => ({
            categoryId,
            articleId: createdArticle.id,
          })),
        );
        return { ...createdArticle, categoryIds: article.categoryIds };
      });
    } catch (error) {
      if (!isDatabaseError) throw error;
      if (error.code === PgErrorCode.NOT_NULL_VIOLATION) {
        throw new BadRequestException(
          `The value of ${error.column} can not be null`,
        );
      }

      if (error.code === PgErrorCode.CHECK_VIOLATION) {
        throw new BadRequestException(`The title can not be an empty string`);
      }
      throw error;
    }
  }

  async getAll({
    offset = 0,
    limit = null,
    idsToSkip = 0,
    queryString = null,
  }: PaginationParamsDto) {
    Logger.warn('Tried to get an article that does not exist');
    Logger.log('Tried to get an article that does not exist');
    Logger.error('Tried to get an article that does not exist');
    Logger.fatal('Tried to get an article that does not exist');
    Logger.debug('Tried to get an article that does not exist');
    Logger.verbose('Tried to get an article that does not exist');
    return this.drizzleService.db.transaction(async (transaction) => {
      const articlesCountResponses = await transaction
        .select({ articlesCount: count() })
        .from(databaseSchema.articles);

      const { articlesCount } = articlesCountResponses.pop();

      const queries: SQL[] = [];

      if (queryString && queryString.trim() !== '') {
        queries.push(sql`
          ${databaseSchema.articles.textTsvector} @@ plainto_tsquery(${queryString})
        `);
        queries.push(sql` AND `);
      }

      queries.push(sql`${databaseSchema.articles.id} > ${idsToSkip}`);

      const query: SQL =
        queries.length === 1 ? queries[0] : sql.join(queries, sql.raw(' '));

      const dataQuery = transaction
        .select()
        .from(databaseSchema.articles)
        .orderBy(asc(databaseSchema.articles.id))
        .offset(offset);

      if (queries.length > 0) {
        dataQuery.where(query);
      }

      if (limit) {
        const data = await dataQuery.limit(+limit);

        return {
          data,
          count: articlesCount,
        };
      }
      const data = await dataQuery;

      return {
        data,
        count: articlesCount,
      };
    });
  }

  async getById(id: number) {
    const article = await this.drizzleService.db.query.articles.findFirst({
      where: eq(databaseSchema.articles.id, id),
      with: { author: true, categoriesArticles: { with: { category: true } } },
    });

    if (!article) {
      throw new NotFoundException();
    }

    return article;
  }

  async updateById(id: number, article: UpdateArticleDto) {
    const updatedArticles = await this.drizzleService.db
      .update(databaseSchema.articles)
      .set(article)
      .where(eq(databaseSchema.articles.id, id))
      .returning();

    if (updatedArticles.length === 0) {
      throw new NotFoundException();
    }

    return updatedArticles.pop();
  }

  async delete(id: number) {
    const deletedArticles = await this.drizzleService.db
      .delete(databaseSchema.articles)
      .where(eq(databaseSchema.articles.id, id))
      .returning();

    if (deletedArticles.length === 0) {
      throw new NotFoundException();
    }
  }
}
