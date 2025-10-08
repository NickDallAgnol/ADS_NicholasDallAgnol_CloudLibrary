// src/books/dto/create-book.dto.ts
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  publisher: string; // agora obrigatório

  @IsString()
  @IsOptional()
  genre?: string;

  @IsString()
  @IsOptional()
  status?: string; // como no schema é String, não enum

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;
}
