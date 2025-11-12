import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'book_id' })
  book!: Book;

  @Column()
  book_id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'borrowed_from_id' })
  borrowedFrom!: User;

  @Column()
  borrowed_from_id!: number;

  @ManyToOne(() => User, (user) => user.loans)
  @JoinColumn({ name: 'lent_by_id' })
  lentBy!: User;

  @Column()
  lent_by_id!: number;

  @CreateDateColumn({ name: 'borrowed_date' })
  borrowedDate!: Date;

  @Column({ nullable: true, name: 'return_date' })
  returnDate?: Date;

  @Column({ default: false, name: 'is_returned' })
  isReturned!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
