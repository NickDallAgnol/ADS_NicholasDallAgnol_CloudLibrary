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
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard';

@Controller('books')
@UseGuards(JwtAuthGuard) // 🔒 protege todas as rotas
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
create(@Request() req, @Body() dto: CreateBookDto) {
  console.log('>>> req.user no controller:', req.user); // 👀 debug
  return this.booksService.create(req.user.userId, dto);
}

  @Get()
  findAll(@Request() req, @Query() query: any) {
    return this.booksService.findAll(req.user.userId, query);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.booksService.getStats(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.booksService.findOne(req.user.userId, Number(id));
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
  ) {
    return this.booksService.update(req.user.userId, Number(id), dto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.booksService.remove(req.user.userId, Number(id));
  }
}
