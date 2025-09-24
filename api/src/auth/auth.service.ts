
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('O email informado já está em uso.');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltOrRounds);

    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
  
  async login(loginDto: LoginDto) {
  // 1. Encontra o usuário pelo email
  const user = await this.usersService.findOneByEmail(loginDto.email);
  if (!user) {
    throw new UnauthorizedException('Credenciais inválidas.');
  }

  // 2. Compara a senha enviada com a senha do banco
  const isPasswordMatching = await bcrypt.compare(
    loginDto.password,
    user.password,
  );

  if (!isPasswordMatching) {
    throw new UnauthorizedException('Credenciais inválidas.');
  }

  // 3. Se a senha estiver correta, gera o token JWT
  const payload = { sub: user.id, email: user.email };
  return {
    access_token: await this.jwtService.signAsync(payload),
  };
}
}