// src/books/dto/create-book.dto.ts
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ReadingStatus } from '../entities/book.entity';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsEnum(ReadingStatus)
  @IsOptional()
  status?: ReadingStatus;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;
}
