// src/books/books.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';

@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto, @Request() req) {
    return this.booksService.create(createBookDto, req.user.userId);
  }

  @Get()
  async findAll(@Request() req, @Query() query: QueryBooksDto) {
    return this.booksService.findAllByUser(req.user.userId, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.booksService.findOneByUser(+id, req.user.userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @Request() req,
  ) {
    return this.booksService.update(+id, req.user.userId, updateBookDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.booksService.remove(+id, req.user.userId);
  }
}
