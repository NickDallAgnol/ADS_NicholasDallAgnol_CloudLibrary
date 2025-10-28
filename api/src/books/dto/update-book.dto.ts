import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { BookStatus } from '../entities/book.entity';
import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'O título não pode ser vazio se fornecido.' })
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'O autor não pode ser vazio se fornecido.' })
  author?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'A editora não pode ser vazia se fornecida.' })
  publisher?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsEnum(BookStatus, {
    message: 'Status do livro inválido. Use TO_READ, READING ou READ.',
  })
  status?: BookStatus;

  @IsOptional()
  @IsInt({ message: 'O progresso deve ser um número inteiro.' })
  @Min(0, { message: 'O progresso mínimo é 0.' })
  @Max(100, { message: 'O progresso máximo é 100.' })
  @Type(() => Number)
  progress?: number;
}
