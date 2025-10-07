// src/books/dto/query-books.dto.ts
import { IsInt, IsOptional, IsString, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ReadingStatus } from '../entities/book.entity';

export class QueryBooksDto {
  @IsOptional()
  @IsString()
  q?: string; // busca por título/autor

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(ReadingStatus)
  status?: ReadingStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}
