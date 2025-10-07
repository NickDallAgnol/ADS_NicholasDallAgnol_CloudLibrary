// src/books/books.service.ts
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';

import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto, userId: number): Promise<Book> {
    const book = this.booksRepository.create({
      ...createBookDto,
      user: { id: userId } as any, // 👈 cast para evitar erro TS
    });
    return this.booksRepository.save(book);
  }

  async findAllByUser(userId: number, query: QueryBooksDto) {
    const { q, category, status, page = 1, limit = 10 } = query;

    const where: any = { user: { id: userId } as any };

    if (q) {
      // busca por título OU autor
      where.title = ILike(`%${q}%`);
      // se quiser buscar também por autor, pode usar QueryBuilder
    }

    if (category) {
      where.genre = ILike(`%${category}%`);
    }

    if (status) {
      where.status = status;
    }

    const [items, total] = await this.booksRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOneByUser(id: number, userId: number): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id, user: { id: userId } as any },
    });
    if (!book) {
      throw new NotFoundException('Livro não encontrado');
    }
    return book;
  }

  async update(
    id: number,
    userId: number,
    updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    const book = await this.findOneByUser(id, userId);
    Object.assign(book, updateBookDto);
    return this.booksRepository.save(book);
  }

  async remove(id: number, userId: number): Promise<void> {
    const book = await this.findOneByUser(id, userId);
    await this.booksRepository.remove(book);
  }
}
