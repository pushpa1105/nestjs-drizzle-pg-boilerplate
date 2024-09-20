import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DrizzleService } from 'src/db/drizzle.service';
import { eq } from 'drizzle-orm';
import { databaseSchema } from 'src/db/schemas';

@Injectable()
export class CategoriesService {
  constructor(private readonly drizzleService: DrizzleService) {}

  async create(category: CreateCategoryDto) {
    try {
      const createdCategories = await this.drizzleService.db
        .insert(databaseSchema.categories)
        .values(category)
        .returning();

      return createdCategories.pop();
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all categories`;
  }

  async findOne(id: number) {
    try {
      const category = await this.drizzleService.db.query.categories.findFirst({
        where: eq(databaseSchema.categories.id, id),
        with: {
          categoriesArticles: {
            with: {
              article: true,
            },
          },
        },
      });

      if (!category) throw new NotFoundException();

      const articles = category.categoriesArticles.map(
        ({ article }) => article,
      );

      return {
        id: category.id,
        name: category.name,
        articles,
      };
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
