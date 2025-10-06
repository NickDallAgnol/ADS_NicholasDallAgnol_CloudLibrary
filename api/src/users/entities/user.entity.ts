// api/src/users/entities/user.entity.ts
import { Book } from '../../books/entities/book.entity'; // 1. IMPORTE A ENTIDADE BOOK
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany, // 2. IMPORTE O ONETOMANY
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // 3. ADICIONE O RELACIONAMENTO
  // Relacionamento: UM usuário pode ter MUITOS livros.
  @OneToMany(() => Book, (book) => book.user)
  books: Book[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}