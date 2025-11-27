import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsEnum,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BookStatus } from '../entities/book.entity';

/**
 * DTO para criação de livros
 * Define validações e estrutura dos dados de entrada
 */
export class CreateBookDto {
  @ApiProperty({ example: 'Dom Casmurro' })
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @MinLength(2)
  title!: string;

  @ApiProperty({ example: 'Machado de Assis' })
  @IsString()
  @IsNotEmpty({ message: 'O autor é obrigatório.' })
  @MinLength(2)
  author!: string;

  @ApiProperty({ example: 'Editora Exemplo', required: false })
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiProperty({ example: 'Ficção Científica', required: false })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({ enum: BookStatus, default: BookStatus.TO_READ })
  @IsOptional()
  @IsEnum(BookStatus, {
    message: 'Status inválido. Use TO_READ, READING ou READ.',
  })
  status?: BookStatus;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt({ message: 'O progresso deve ser um número inteiro.' })
  @Min(0, { message: 'O progresso mínimo é 0.' })
  @Max(100, { message: 'O progresso máximo é 100.' })
  @Type(() => Number)
  progress?: number;

  @ApiProperty({ example: true, required: false, description: 'Se o livro está disponível para empréstimo' })
  @IsOptional()
  @IsBoolean({ message: 'availableForLoan deve ser um valor booleano.' })
  @Type(() => Boolean)
  availableForLoan?: boolean;
}
