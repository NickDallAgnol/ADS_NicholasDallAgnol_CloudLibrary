import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard';

@Controller('books')
@UseGuards(JwtAuthGuard) // garante que só usuários autenticados acessem
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateBookDto) {
    return this.booksService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req, @Query() query: any) {
    return this.booksService.findAll(req.user.id, query);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.booksService.findOne(req.user.id, +id);
  }

  @Patch(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(req.user.id, +id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.booksService.remove(req.user.id, +id);
  }

  // 👇 Nova rota para estatísticas
  @Get('stats/overview')
  getStats(@Req() req) {
    return this.booksService.getStats(req.user.id);
  }
}
