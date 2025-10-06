// api/src/books/books.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { User } from '../users/entities/user.entity'; // Importe a entidade User

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(User) // Injetar o repositório de usuários também
    private usersRepository: Repository<User>,
  ) {}

  async create(createBookDto: CreateBookDto, userId: string): Promise<Book> {
    // 1. Encontrar o usuário pelo ID
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Usuário não encontrado.'); // Ou uma exceção HTTP mais apropriada
    }

    // 2. Criar uma nova instância de livro
    const book = this.booksRepository.create(createBookDto);
    book.user = user; // 3. Associar o livro ao usuário logado

    // 4. Salvar o livro no banco de dados
    return this.booksRepository.save(book);
  }

  // findAll, findOne, update, remove serão implementados depois
  findAll() {
    return `This action returns all books`;
  }

  findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
}