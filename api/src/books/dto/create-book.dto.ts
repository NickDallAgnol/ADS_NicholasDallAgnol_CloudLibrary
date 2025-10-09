// api/src/books/dto/create-book.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

// Definição dos status possíveis para um livro
export enum BookStatus {
  TO_READ = 'A LER',
  READING = 'LENDO',
  READ = 'LIDO',
}

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'O autor é obrigatório.' })
  author: string;

  @IsString()
  @IsNotEmpty({ message: 'A editora é obrigatória.' })
  publisher: string; // Editora é agora obrigatória

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsEnum(BookStatus, { message: 'Status do livro inválido. Use "A LER", "LENDO" ou "LIDO".' })
  status?: BookStatus; // O status pode ser opcional, com um valor padrão no serviço/entidade

  @IsOptional()
  @IsInt({ message: 'O progresso deve ser um número inteiro.' })
  @Min(0, { message: 'O progresso mínimo é 0.' })
  @Max(100, { message: 'O progresso máximo é 100.' })
  @Type(() => Number) // Garante que o valor seja transformado em número
  progress?: number;
}