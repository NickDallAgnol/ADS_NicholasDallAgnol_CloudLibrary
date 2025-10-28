import { IsOptional, IsString, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { BookStatus } from '../entities/book.entity';


export class QueryBooksDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsEnum(BookStatus, {
    message: 'Status de livro inválido. Use TO_READ, READING ou READ.',
  })
  status?: BookStatus;

  @IsOptional()
  @IsInt({ message: 'A página deve ser um número inteiro.' })
  @Min(1, { message: 'A página mínima é 1.' })
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt({ message: 'O limite deve ser um número inteiro.' })
  @Min(1, { message: 'O limite mínimo é 1.' })
  @Max(100, { message: 'O limite máximo é 100.' })
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @IsString()
  sortBy: string = 'title';

  @IsOptional()
  @IsString()
  sortOrder: 'asc' | 'desc' = 'asc';
}
