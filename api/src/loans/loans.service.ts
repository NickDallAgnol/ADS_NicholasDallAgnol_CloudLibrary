import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private readonly loansRepository: Repository<Loan>,
  ) {}

  async create(userId: number, dto: CreateLoanDto): Promise<Loan> {
    const loan = this.loansRepository.create({
      ...dto,
      lentBy: { id: userId },
    });
    return this.loansRepository.save(loan);
  }

  async findAll(userId: number, query: any = {}): Promise<{
    data: Loan[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, returnedOnly = false } = query;

    const qb = this.loansRepository
      .createQueryBuilder('loan')
      .where('loan.lent_by_id = :userId', { userId })
      .orWhere('loan.borrowed_from_id = :userId', { userId });

    if (returnedOnly) {
      qb.andWhere('loan.is_returned = true');
    }

    qb.orderBy('loan.borrowed_date', 'DESC');
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
    });

    if (!loan || (loan.lentBy.id !== userId && loan.borrowedFrom.id !== userId)) {
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
    return this.loansRepository.save(loan);
  }

  async remove(userId: number, id: number): Promise<void> {
    const loan = await this.findOne(userId, id);
    await this.loansRepository.remove(loan);
  }
}
