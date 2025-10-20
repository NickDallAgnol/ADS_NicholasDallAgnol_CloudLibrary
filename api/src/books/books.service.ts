import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async create(userId: number, dto: CreateBookDto) {
    const newBook = this.booksRepository.create({
      ...dto,
      user: { id: userId }, // 🔥 relacionamento correto
    });
    return this.booksRepository.save(newBook);
  }

  async findAll(userId: number, query: any) {
    const { q, status, page = 1, limit = 10 } = query;

    const qb = this.booksRepository.createQueryBuilder('book');
    qb.where('book.userId = :userId', { userId });

    if (status) {
      qb.andWhere('book.status = :status', { status });
    }

    if (q) {
      qb.andWhere('(book.title ILIKE :q OR book.author ILIKE :q)', {
        q: `%${q}%`,
      });
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(userId: number, id: number) {
    const book = await this.booksRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!book) throw new NotFoundException('Livro não encontrado');
    return book;
  }

  async update(userId: number, id: number, dto: UpdateBookDto) {
    const book = await this.findOne(userId, id);
    Object.assign(book, dto);
    return this.booksRepository.save(book);
  }

  async remove(userId: number, id: number) {
    const book = await this.findOne(userId, id);
    return this.booksRepository.remove(book);
  }

  async getStats(userId: number) {
    const total = await this.booksRepository.count({ where: { user: { id: userId } } });
    const toRead = await this.booksRepository.count({
      where: { user: { id: userId }, status: 'TO_READ' },
    });
    const reading = await this.booksRepository.count({
      where: { user: { id: userId }, status: 'READING' },
    });
    const read = await this.booksRepository.count({
      where: { user: { id: userId }, status: 'READ' },
    });

    return { total, toRead, reading, read };
  }
}
