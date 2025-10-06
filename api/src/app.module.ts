// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');
        return databaseUrl
          ? {
              type: 'postgres',
              url: databaseUrl,
              autoLoadEntities: true,
              synchronize: true, // só em DEV; em PROD usar migrations
            }
          : {
              type: 'postgres',
              host: config.get('DB_HOST', 'localhost'),
              port: parseInt(config.get('DB_PORT', '5432')),
              username: config.get('DB_USER', 'postgres'),
              password: config.get('DB_PASSWORD', 'masterkey'),
              database: config.get('DB_NAME', 'cloudlibrary_db'),
              autoLoadEntities: true,
              synchronize: true, // só em DEV
            };
      },
    }),
    AuthModule,
    UsersModule,
    BooksModule,
  ],
})
export class AppModule {}
