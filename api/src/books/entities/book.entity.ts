// src/books/entities/book.entity.ts
// src/books/entities/book.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ReadingStatus {
  TO_READ = 'A LER',
  READING = 'LENDO',
  READ = 'LIDO',
}

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  author: string;

  @Column({ length: 255, nullable: true })
  publisher: string;

  @Column({ length: 100, nullable: true })
  genre: string;

  @Column({
    type: 'enum',
    enum: ReadingStatus,
    default: ReadingStatus.TO_READ,
  })
  status: ReadingStatus;

  @Column({ type: 'int', default: 0 })
  progress: number; // percentual de leitura (0–100)

  @ManyToOne(() => User, (user) => user.books, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
