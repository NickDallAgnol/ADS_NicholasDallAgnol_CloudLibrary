import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookStatus } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  /**
   * Cria um novo livro vinculado ao usuário
   * Utiliza query direta para garantir a correta associação do user_id
   */
  async create(userId: number, dto: CreateBookDto): Promise<Book> {
    try {
      // Prepara os dados do livro
      const bookData: Partial<Book> = {
        title: dto.title,
        author: dto.author,
        publisher: dto.publisher,
        genre: dto.genre,
        status: dto.status || BookStatus.TO_READ,
        progress: dto.progress || 0,
      };
      
      const book = this.booksRepository.create(bookData);
      const savedBook = await this.booksRepository.save(book);
      
      // Atualizar user_id via query com sintaxe PostgreSQL correta
      await this.booksRepository.query(
        'UPDATE books SET user_id = $1 WHERE id = $2',
        [userId, savedBook.id],
      );
      
      // Retornar o livro com a relação
      const result = await this.booksRepository.findOne({
        where: { id: savedBook.id },
        relations: ['user'],
      });
      return result as Book;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Lista os livros do usuário com paginação e filtros
   * Suporta busca por título/autor e filtro por status
   */
  async findAll(userId: number, query: QueryBooksDto): Promise<{
    data: Book[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    // Normaliza e valida os parâmetros de busca
    let { q, status, page, limit } = query;
    
    // Converter strings vazias em undefined/null
    q = q && String(q).trim() ? String(q).trim() : undefined;
    let statusEnum: BookStatus | undefined = undefined;
    if (status && String(status).trim()) {
      const statusStr = String(status).trim().toUpperCase();
      if (Object.values(BookStatus).includes(statusStr as BookStatus)) {
        statusEnum = statusStr as BookStatus;
      }
    }
    page = page ? Number(page) : 1;
    limit = limit ? Number(limit) : 10;

    // Constrói a query com joins e filtros dinâmicos
    let query_builder = this.booksRepository.createQueryBuilder('book')
      .leftJoinAndSelect('book.user', 'user')
      .where('book.user_id = :userId', { userId });

    if (statusEnum) {
      query_builder = query_builder.andWhere('book.status = :status', { status: statusEnum });
    }

    if (q && q.length > 0) {
      query_builder = query_builder.andWhere(
        '(LOWER(book.title) LIKE LOWER(:q) OR LOWER(book.author) LIKE LOWER(:q))',
        { q: `%${q}%` }
      );
    }

    query_builder = query_builder.orderBy('book.id', 'DESC');
    query_builder = query_builder.skip((page - 1) * limit).take(limit);

    const [data, total] = await query_builder.getManyAndCount();

    return {
      data,
      total,
      page: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(userId: number, id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });

    if (!book) {
      throw new NotFoundException('Livro não encontrado');
    }

    return book;
  }

  async update(userId: number, id: number, dto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(userId, id);
    
    if (dto.title !== undefined) book.title = dto.title;
    if (dto.author !== undefined) book.author = dto.author;
    if (dto.publisher !== undefined) book.publisher = dto.publisher;
    if (dto.genre !== undefined) book.genre = dto.genre;
    if (dto.status !== undefined) book.status = dto.status;
    if (dto.progress !== undefined) book.progress = dto.progress;

    return this.booksRepository.save(book);
  }

  async remove(userId: number, id: number): Promise<Book> {
    const book = await this.findOne(userId, id);
    return this.booksRepository.remove(book);
  }

  /**
   * Calcula estatísticas de leitura do usuário
   * Retorna contadores por status de leitura
   */
  async getStats(userId: number): Promise<{
    total: number;
    toRead: number;
    reading: number;
    read: number;
  }> {
    const total = await this.booksRepository.count({
      where: { user: { id: userId } },
    });

    const toRead = await this.booksRepository.count({
      where: { user: { id: userId }, status: BookStatus.TO_READ },
    });

    const reading = await this.booksRepository.count({
      where: { user: { id: userId }, status: BookStatus.READING },
    });

    const read = await this.booksRepository.count({
      where: { user: { id: userId }, status: BookStatus.READ },
    });

    return { total, toRead, reading, read };
  }
}
