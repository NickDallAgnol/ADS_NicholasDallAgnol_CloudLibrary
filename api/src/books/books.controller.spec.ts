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
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard';

@Controller('books')
@UseGuards(JwtAuthGuard) // todas as rotas exigem autenticação
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  // Criar livro
  @Post()
  create(@Request() req: any, @Body() dto: CreateBookDto) {
    return this.booksService.create(req.user.id, dto);
  }

  // Listar livros com filtros, paginação e ordenação
  @Get()
  findAll(@Request() req: any, @Query() query: any) {
    return this.booksService.findAll(req.user.id, query);
  }

  // Buscar livro por ID
  @Get(':id')
  findOne(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(req.user.id, id);
  }

  // Atualizar livro
  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookDto,
  ) {
    return this.booksService.update(req.user.id, id, dto);
  }

  // Deletar livro
  @Delete(':id')
  remove(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(req.user.id, id);
  }

  // Estatísticas do usuário
  @Get('stats')
  getStats(@Request() req: any) {
    return this.booksService.getStats(req.user.id);
  }
}
