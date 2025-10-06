// src/books/dto/create-book.dto.ts
import { IsInt, IsOptional, IsString, IsEnum, IsDateString, Min, MaxLength } from 'class-validator';

export enum StatusLeitura {
  LER = 'LER',
  LENDO = 'LENDO',
  LIDO = 'LIDO',
  ABANDONADO = 'ABANDONADO',
}

export class CreateBookDto {
  @IsString() @MaxLength(200)
  title: string;

  @IsString() @MaxLength(120)
  author: string;

  @IsOptional() @IsString() @MaxLength(120)
  publisher?: string;

  @IsOptional() @IsString() @MaxLength(80)
  category?: string;

  @IsOptional() @IsEnum(StatusLeitura)
  status?: StatusLeitura;

  @IsOptional() @IsInt() @Min(1)
  pages?: number;

  @IsOptional() @IsDateString()
  startedAt?: string;

  @IsOptional() @IsDateString()
  finishedAt?: string;
}
