// api/src/books/dto/create-book.dto.ts
import { IsString, IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @IsString({ message: 'O título deve ser uma string.' })
  @IsNotEmpty({ message: 'O título não pode ser vazio.' })
  title: string;

  @IsString({ message: 'O autor deve ser uma string.' })
  @IsNotEmpty({ message: 'O autor não pode ser vazio.' })
  author: string;

  @IsInt({ message: 'O ano de publicação deve ser um número inteiro.' })
  @Min(1000, { message: 'O ano de publicação deve ser no mínimo 1000.' })
  @Max(new Date().getFullYear(), { message: 'O ano de publicação não pode ser no futuro.' })
  @IsNotEmpty({ message: 'O ano de publicação não pode ser vazio.' })
  publicationYear: number;
}