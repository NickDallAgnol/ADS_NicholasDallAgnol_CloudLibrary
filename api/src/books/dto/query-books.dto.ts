// src/books/dto/query-books.dto.ts
import { IsInt, IsOptional, IsString, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusLeitura } from './create-book.dto';

export class QueryBooksDto {
  @IsOptional() @IsString()
  q?: string; // busca por título/autor

  @IsOptional() @IsString()
  category?: string;

  @IsOptional() @IsEnum(StatusLeitura)
  status?: StatusLeitura;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit?: number = 10;
}
