import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module'; // exemplo
import { User } from './users/entities/user.entity';
import { Book } from './books/entities/book.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // carrega o .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Book],
      synchronize: true, // cuidado: use false em produção
    }),
    TypeOrmModule.forFeature([Book]), // se quiser usar o repositório direto
    BooksModule,
  ],
})
export class AppModule {}
