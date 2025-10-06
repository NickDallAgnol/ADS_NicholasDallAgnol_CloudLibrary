// api/src/books/books.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importe TypeOrmModule
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { Book } from './entities/book.entity';
import { User } from '../users/entities/user.entity'; // Importe a entidade User

@Module({
  imports: [TypeOrmModule.forFeature([Book, User])], // Adicione Book E User aos repositórios
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}