// api/src/books/books.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, // Importe UseGuards
  Request,   // Importe Request
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt.guard'; // Importe nosso guarda

@UseGuards(JwtAuthGuard) // 1. Aplica o guarda a TODAS as rotas deste controller
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // Rota para CRIAR um novo livro
  @Post()
  create(@Body() createBookDto: CreateBookDto, @Request() req) {
    // 2. Extrai o ID do usuário do token (anexado pelo JwtAuthGuard)
    const userId = req.user.userId;

    // 3. Chama o serviço, passando os dados do livro e o ID do usuário
    return this.booksService.create(createBookDto, userId);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}