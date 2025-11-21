import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido.' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password?: string;

  @IsOptional()
  @IsString()
  favoriteBook?: string;

  @IsOptional()
  @IsString()
  favoriteAuthor?: string;

  @IsOptional()
  @IsString()
  favoriteGenre?: string;

  @IsOptional()
  yearlyReadingGoal?: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
