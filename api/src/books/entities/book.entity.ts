// src/books/entities/book.entity.ts
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { StatusLeitura } from '../dto/create-book.dto';

@Entity('books')
@Index(['user', 'title'])
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 120 })
  author: string;

  @Column({ length: 120, nullable: true })
  publisher?: string;

  @Column({ length: 80, nullable: true })
  category?: string;

  @Column({ type: 'enum', enum: StatusLeitura, default: StatusLeitura.LER })
  status: StatusLeitura;

  @Column({ type: 'int', nullable: true })
  pages?: number;

  @Column({ type: 'date', nullable: true })
  startedAt?: string;

  @Column({ type: 'date', nullable: true })
  finishedAt?: string;

  @ManyToOne(() => User, (u) => u.books, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
