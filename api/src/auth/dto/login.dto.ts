import { IsEmail, IsString, IsNotEmpty, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @Matches(
    /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|icloud|protonmail|live|msn|aol|zoho|mail|yandex|tutanota)\.(com|br|net|org|co\.uk|de|fr|es|it|pt)$/i,
    { message: 'Use um email de provedor válido' }
  )
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password!: string;
}
