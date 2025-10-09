// api/src/books/dto/update-book.dto.ts
import { PartialType } from '@nestjs/mapped-types'; // Para NestJS 9+
// ou import { PartialType } from '@nestjs/swagger'; // Se estiver usando Swagger
import { CreateBookDto, BookStatus } from './create-book.dto';
import { IsString, IsOptional, IsInt, Min, Max, IsEnum, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  // O PartialType já torna todas as propriedades de CreateBookDto opcionais.
  // Podemos adicionar validações específicas ou sobrescrever, se necessário.

  // Exemplo: se quisesse que o título, mesmo sendo opcional, não pudesse ser uma string vazia se fornecido.
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
  @IsEnum(BookStatus, { message: 'Status do livro inválido. Use "A LER", "LENDO" ou "LIDO".' })
  status?: BookStatus;

  @IsOptional()
  @IsInt({ message: 'O progresso deve ser um número inteiro.' })
  @Min(0, { message: 'O progresso mínimo é 0.' })
  @Max(100, { message: 'O progresso máximo é 100.' })
  @Type(() => Number)
  progress?: number;
}