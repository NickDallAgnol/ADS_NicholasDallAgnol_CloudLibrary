import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum BookStatus {
  TO_READ = 'TO_READ',
  READING = 'READING',
  READ = 'READ',
}

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

  @ManyToOne(() => User, (user) => user.books, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
