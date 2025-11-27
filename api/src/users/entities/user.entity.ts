import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { Loan } from '../../loans/entities/loan.entity';

/**
 * Entidade de usuários
 * Armazena dados do usuário e preferências de leitura
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  // Preferências pessoais de leitura
  @Column({ nullable: true, length: 200 })
  favoriteBook?: string;

  @Column({ nullable: true, length: 100 })
  favoriteAuthor?: string;

  @Column({ nullable: true, length: 50 })
  favoriteGenre?: string;

  @Column({ nullable: true, type: 'int', default: 0 })
  yearlyReadingGoal?: number;

  @Column({ nullable: true, type: 'text' })
  bio?: string;

  @Column({ nullable: true, type: 'text' })
  avatarUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => Book, (book) => book.user, { cascade: true })
  books!: Book[];

  @OneToMany(() => Loan, (loan) => loan.lentBy, { cascade: true })
  loans!: Loan[];
}
