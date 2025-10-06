// src/books/books.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { UserId } from '../auth/decorators/user-id.decorator';

@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly service: BooksService) {}

  /**
   * Cria um novo livro vinculado ao usuário logado.
   */
  @Post()
  create(@UserId() userId: string, @Body() dto: CreateBookDto) {
    return this.service.create(userId, dto);
  }

  /**
   * Lista todos os livros do usuário logado (com filtros e paginação).
   */
  @Get()
  findAll(@UserId() userId: string, @Query() query: QueryBooksDto) {
    return this.service.findAll(userId, query);
  }

  /**
   * Retorna os dados de um livro específico.
   */
  @Get(':id')
  findOne(@UserId() userId: string, @Param('id') id: string) {
    return this.service.findOne(userId, id);
  }

  /**
   * Atualiza um livro do usuário.
   */
  @Patch(':id')
  update(
    @UserId() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
  ) {
    return this.service.update(userId, id, dto);
  }

  /**
   * Remove um livro do usuário.
   */
  @Delete(':id')
  remove(@UserId() userId: string, @Param('id') id: string) {
    return this.service.remove(userId, id);
  }
}
