import { IsEmail, IsString, MinLength, IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @Matches(
    /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|icloud|protonmail|live|msn|aol|zoho|mail|yandex|tutanota)\.(com|br|net|org|co\.uk|de|fr|es|it|pt)$/i,
    { message: 'Use um email de provedor válido' }
  )
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Nova senha é obrigatória' })
  @MinLength(6, { message: 'Nova senha deve ter no mínimo 6 caracteres' })
  @MaxLength(50, { message: 'Nova senha deve ter no máximo 50 caracteres' })
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
    { message: 'Nova senha deve conter pelo menos uma letra e um número' }
  )
  newPassword!: string;
}
