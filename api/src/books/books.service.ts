// src/books/books.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly repo: Repository<Book>,
  ) {}

  /**
   * Cria um livro para o usuário logado.
   */
  async create(userId: string, dto: CreateBookDto) {
    const book = this.repo.create({
      ...dto,
      user: { id: userId } as any,
    });
    return this.repo.save(book);
  }

  /**
   * Lista livros do usuário com paginação e filtros.
   * Filtros:
   *  - q: busca por título OU autor (case-insensitive)
   *  - category
   *  - status
   * Paginação:
   *  - page (1..n), limit (1..n)
   */
  async findAll(userId: string, query: QueryBooksDto) {
    const { q, category, status, page = 1, limit = 10 } = query;

    const qb = this.repo.createQueryBuilder('b')
      .leftJoin('b.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere(
        q ? '(LOWER(b.title) LIKE :q OR LOWER(b.author) LIKE :q)' : '1=1',
        q ? { q: `%${q.toLowerCase()}%` } : {},
      )
      .andWhere(category ? 'b.category = :category' : '1=1', { category })
      .andWhere(status ? 'b.status = :status' : '1=1', { status })
      .orderBy('b.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Busca um livro do usuário por ID ou lança 404.
   */
  private async findOneOrThrow(userId: string, id: string) {
    const book = await this.repo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!book) throw new NotFoundException('Livro não encontrado');
    return book;
  }

  /**
   * Retorna um livro específico do usuário.
   */
  async findOne(userId: string, id: string) {
    return this.findOneOrThrow(userId, id);
  }

  /**
   * Atualiza um livro do usuário.
   */
  async update(userId: string, id: string, dto: UpdateBookDto) {
    const book = await this.findOneOrThrow(userId, id);
    Object.assign(book, dto);
    return this.repo.save(book);
  }

  /**
   * Remove um livro do usuário.
   */
  async remove(userId: string, id: string) {
    const book = await this.findOneOrThrow(userId, id);
    await this.repo.remove(book);
    return { deleted: true };
  }
}
