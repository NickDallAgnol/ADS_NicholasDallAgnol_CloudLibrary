// src/books/dto/create-book.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookStatus } from '../entities/book.entity'; // 👈 usa o mesmo enum da entidade

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'O autor é obrigatório.' })
  author: string;

  @IsString()
  @IsNotEmpty({ message: 'A editora é obrigatória.' })
  publisher: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsEnum(BookStatus, {
    message: 'Status inválido. Use TO_READ, READING ou READ.',
  })
  status?: BookStatus;

  @IsOptional()
  @IsInt({ message: 'O progresso deve ser um número inteiro.' })
  @Min(0, { message: 'O progresso mínimo é 0.' })
  @Max(100, { message: 'O progresso máximo é 100.' })
  @Type(() => Number)
  progress?: number;
}
