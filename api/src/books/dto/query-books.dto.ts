import { IsOptional, IsString, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { BookStatus } from './create-book.dto'; // Importa BookStatus do create-book.dto.ts

export class QueryBooksDto {
  @IsOptional()
  @IsString()
  q?: string; // Termo de busca (título ou autor)

  @IsOptional()
  @IsEnum(BookStatus, { message: 'Status de livro inválido. Use "A LER", "LENDO" ou "LIDO".' })
  status?: BookStatus;

  @IsOptional()
  @IsInt({ message: 'A página deve ser um número inteiro.' })
  @Min(1, { message: 'A página mínima é 1.' })
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt({ message: 'O limite deve ser um número inteiro.' })
  @Min(1, { message: 'O limite mínimo é 1.' })
  @Max(100, { message: 'O limite máximo é 100.' })
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'title'; // Campo para ordenação

  @IsOptional()
  @IsString() // Poderíamos usar @IsEnum se quiséssemos restringir 'asc' | 'desc'
  sortOrder?: 'asc' | 'desc' = 'asc'; // Ordem da ordenação
}