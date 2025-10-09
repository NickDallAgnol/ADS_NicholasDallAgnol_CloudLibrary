import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  publisher: string;

  @Column({ nullable: true })
  genre?: string;

  @Column({ default: 'A LER' })
  status: string;

  @Column({ default: 0 })
  progress: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.books, { onDelete: 'CASCADE' })
  user: User;
}
