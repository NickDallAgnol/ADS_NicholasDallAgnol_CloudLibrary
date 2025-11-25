import { IsEmail, IsString, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name!: string;

  @IsEmail({}, { message: 'Email inválido. Use um email válido de um provedor real' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @Matches(
    /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|icloud|protonmail|live|msn|aol|zoho|mail|yandex|tutanota)\.(com|br|net|org|co\.uk|de|fr|es|it|pt)$/i,
    { message: 'Use um email de provedor válido (Gmail, Outlook, Yahoo, Hotmail, etc.)' }
  )
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  @MaxLength(50, { message: 'Senha deve ter no máximo 50 caracteres' })
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
    { message: 'Senha deve conter pelo menos uma letra e um número' }
  )
  password!: string;
}
