// src/books/books.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly allowedSortFields: string[] = [
    'id',
    'title',
    'author',
    'status',
    'progress',
  ];

  async create(userId: number, dto: CreateBookDto) {
    return this.prisma.book.create({
      data: {
        title: dto.title,
        author: dto.author,
        publisher: dto.publisher, // obrigatório
        genre: dto.genre ?? null,
        status: dto.status ?? 'A LER',
        progress: dto.progress ?? 0,
        userId,
      },
    });
  }

  async findAll(
    userId: number,
    query: {
      q?: string;
      status?: string;
      page?: number | string;
      limit?: number | string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc' | string;
    },
  ) {
    const q = query.q?.trim();
    const status = query.status?.trim();
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const sortByRaw = (query.sortBy ?? 'title').trim();
    const sortOrder: Prisma.SortOrder =
      query.sortOrder?.toLowerCase() === 'desc' ? 'desc' : 'asc';

    if (!Number.isFinite(page) || page < 1) {
      throw new BadRequestException('Parâmetro "page" inválido');
    }
    if (!Number.isFinite(limit) || limit < 1 || limit > 100) {
      throw new BadRequestException('Parâmetro "limit" inválido (1–100)');
    }

    const sortBy = this.allowedSortFields.includes(sortByRaw)
      ? sortByRaw
      : 'title';

    const where: Prisma.BookWhereInput = { userId: userId };
    if (status) where.status = status;
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { author: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder } as any,
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(userId: number, id: number) {
    const book = await this.prisma.book.findFirst({
      where: { id, userId },
    });
    if (!book) throw new NotFoundException('Livro não encontrado');
    return book;
  }

  async update(userId: number, id: number, dto: UpdateBookDto) {
    await this.findOne(userId, id);

    const data: Prisma.BookUpdateInput = {};
    if (dto.title !== undefined) data.title = { set: dto.title };
    if (dto.author !== undefined) data.author = { set: dto.author };
    if (dto.publisher !== undefined) data.publisher = { set: dto.publisher };
    if (dto.genre !== undefined) data.genre = { set: dto.genre };
    if (dto.status !== undefined) data.status = { set: dto.status };
    if (dto.progress !== undefined) data.progress = { set: dto.progress };

    return this.prisma.book.update({
      where: { id },
      data,
    });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);
    return this.prisma.book.delete({
      where: { id },
    });
  }

  async getStats(userId: number) {
    const [total, toRead, reading, read] = await Promise.all([
      this.prisma.book.count({ where: { userId } }),
      this.prisma.book.count({ where: { userId, status: 'A LER' } }),
      this.prisma.book.count({ where: { userId, status: 'LENDO' } }),
      this.prisma.book.count({ where: { userId, status: 'LIDO' } }),
    ]);

    return { total, toRead, reading, read };
  }
}
