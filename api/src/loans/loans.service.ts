import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { Book } from '../books/entities/book.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private readonly loansRepository: Repository<Loan>,
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async create(userId: number, dto: CreateLoanDto): Promise<Loan> {
    const loan = this.loansRepository.create({
      ...dto,
      lentBy: { id: userId },
    });
    
    // Marca o livro como indisponível para empréstimo
    const book = await this.booksRepository.findOne({ where: { id: dto.book_id } });
    if (book) {
      book.availableForLoan = false;
      await this.booksRepository.save(book);
    }
    
    return this.loansRepository.save(loan);
  }

  async findAll(userId: number, query: any = {}): Promise<{
    data: Loan[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, returnedOnly = false } = query;

    // Mostrar apenas empréstimos onde o usuário é o DONO do livro (lent_by)
    // Ou seja, livros que ELE emprestou para outros
    const qb = this.loansRepository
      .createQueryBuilder('loan')
      .leftJoinAndSelect('loan.lentBy', 'lentBy')
      .leftJoinAndSelect('loan.borrowedFrom', 'borrowedFrom')
      .leftJoinAndSelect('loan.book', 'book')
      .where('loan.lent_by_id = :userId', { userId });

    if (returnedOnly) {
      qb.andWhere('loan.is_returned = true');
    }

    qb.orderBy('loan.id', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(userId: number, id: number): Promise<Loan> {
    const loan = await this.loansRepository.findOne({
      where: { id },
      relations: ['lentBy', 'borrowedFrom', 'book'],
    });

    // Verificar se o usuário é o DONO do livro (lent_by)
    if (!loan || loan.lent_by_id !== userId) {
      throw new NotFoundException('Empréstimo não encontrado');
    }

    return loan;
  }

  async update(userId: number, id: number, dto: UpdateLoanDto): Promise<Loan> {
    const loan = await this.findOne(userId, id);
    
    if (dto.book_id !== undefined) loan.book_id = dto.book_id;
    if (dto.borrowed_from_id !== undefined) loan.borrowed_from_id = dto.borrowed_from_id;
    if (dto.isReturned !== undefined) loan.isReturned = dto.isReturned;
    if (dto.returnDate !== undefined) loan.returnDate = dto.returnDate;
    
    return this.loansRepository.save(loan);
  }

  async returnLoan(userId: number, id: number): Promise<Loan> {
    const loan = await this.findOne(userId, id);
    loan.isReturned = true;
    loan.returnDate = new Date();
    
    // Marca o livro como disponível para empréstimo novamente
    const book = await this.booksRepository.findOne({ where: { id: loan.book_id } });
    if (book) {
      book.availableForLoan = true;
      await this.booksRepository.save(book);
    }
    
    return this.loansRepository.save(loan);
  }

  async remove(userId: number, id: number): Promise<void> {
    const loan = await this.findOne(userId, id);
    
    // Se o livro não foi devolvido, marca como disponível novamente
    if (!loan.isReturned) {
      const book = await this.booksRepository.findOne({ where: { id: loan.book_id } });
      if (book) {
        book.availableForLoan = true;
        await this.booksRepository.save(book);
      }
    }
    
    await this.loansRepository.remove(loan);
  }
}
