import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsEnum,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BookStatus } from '../entities/book.entity';

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
}
