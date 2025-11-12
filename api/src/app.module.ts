import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoansModule } from './loans/loans.module';
import { User } from './users/entities/user.entity';
import { Book } from './books/entities/book.entity';
import { Loan } from './loans/entities/loan.entity';

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
      entities: [User, Book, Loan],
      synchronize: true, // cuidado: use false em produção
    }),
    TypeOrmModule.forFeature([Book, User, Loan]), // se quiser usar o repositório direto
    BooksModule,
    UsersModule,
    AuthModule,
    LoansModule,
  ],
})
export class AppModule {}
