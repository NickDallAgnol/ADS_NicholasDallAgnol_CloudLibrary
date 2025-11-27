import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt/jwt-auth.guard';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request as ExpressRequest } from 'express';

/**
 * Controller de autenticação
 * Gerencia registro, login e perfil de usuários
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: ExpressRequest) {
    // Retorna os dados atualizados do usuário autenticado
    const userId = (req.user as any).id;
    return this.authService.getUserById(userId);
  }
}
