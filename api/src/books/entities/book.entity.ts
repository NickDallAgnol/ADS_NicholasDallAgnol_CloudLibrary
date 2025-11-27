import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * Enum de status de leitura
 */
export enum BookStatus {
  TO_READ = 'TO_READ',   // Para ler
  READING = 'READING',   // Lendo
  READ = 'READ',         // Lido
}

/**
 * Entidade de livros
 * Representa um livro no acervo pessoal do usuário
 */
@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  author!: string;

  @Column({ nullable: true })
  publisher?: string;

  @Column({ nullable: true })
  genre?: string;

  @Column({
    type: 'enum',
    enum: BookStatus,
    default: BookStatus.TO_READ,
  })
  status!: BookStatus;

  @Column({ type: 'int', default: 0 })
  progress!: number;

  @Column({ type: 'boolean', default: true, name: 'available_for_loan' })
  availableForLoan!: boolean;

  // Relação com o proprietário do livro
  @ManyToOne(() => User, (user) => user.books, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
