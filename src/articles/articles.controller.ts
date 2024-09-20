import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'src/auth/interface/request-with-user.interface';
import { PaginationParamsDto } from 'src/utils/dto/pagination-params.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(@Body() article: CreateArticleDto, @Req() request: RequestWithUser) {
    return this.articlesService.create(article, request.user.id);
  }

  @Get()
  getAll(@Query() paginationParams: PaginationParamsDto) {
    return this.articlesService.getAll(paginationParams);
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.articlesService.getById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() article: UpdateArticleDto) {
    return this.articlesService.updateById(+id, article);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.articlesService.delete(+id);
  }
}
