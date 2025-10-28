import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookStatus } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto'; // se estiver usando DTO para filtros

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async create(userId: number, dto: CreateBookDto): Promise<Book> {
    const newBook = this.booksRepository.create({
      ...dto,
      user: { id: userId },
    });
    return this.booksRepository.save(newBook);
  }

  async findAll(userId: number, query: QueryBooksDto): Promise<{
    data: Book[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { q, status, page = 1, limit = 10, sortBy = 'title', sortOrder = 'ASC' } = query;

    const qb = this.booksRepository.createQueryBuilder('book')
      .leftJoin('book.user', 'user')
      .where('user.id = :userId', { userId });

    if (status) {
      qb.andWhere('book.status = :status', { status });
    }

    if (q) {
      qb.andWhere('(book.title ILIKE :q OR book.author ILIKE :q)', {
        q: `%${q}%`,
      });
    }

    qb.orderBy(`book.${sortBy}`, sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(userId: number, id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!book || book.user.id !== userId) {
      throw new NotFoundException('Livro não encontrado');
    }

    return book;
  }

  async update(userId: number, id: number, dto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(userId, id);
    Object.assign(book, dto);
    return this.booksRepository.save(book);
  }

  async remove(userId: number, id: number): Promise<Book> {
    const book = await this.findOne(userId, id);
    return this.booksRepository.remove(book);
  }

  async getStats(userId: number): Promise<{
    total: number;
    toRead: number;
    reading: number;
    read: number;
  }> {
    const [total, toRead, reading, read] = await Promise.all([
      this.booksRepository.count({ where: { user: { id: userId } } }),
      this.booksRepository.count({ where: { user: { id: userId }, status: BookStatus.TO_READ } }),
      this.booksRepository.count({ where: { user: { id: userId }, status: BookStatus.READING } }),
      this.booksRepository.count({ where: { user: { id: userId }, status: BookStatus.READ } }),
    ]);

    return { total, toRead, reading, read };
  }
}
