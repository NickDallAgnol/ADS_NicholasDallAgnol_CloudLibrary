import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  // ENDPOINTS REMOVIDOS POR SEGURANÇA (não devem estar em produção)
  // - check-database: expõe informações sensíveis dos usuários
  // - reset-database: perigoso, pode apagar todos os dados
  // - delete-invalid-users: pode causar perda de dados não intencional
  
  // Para desenvolvimento/testes, descomentar temporariamente quando necessário
  
  /* 
  @Get('check-database')
  async checkDatabase() {
    const users = await this.usersService.findAll();
    return {
      totalUsers: users.length,
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        hasPasswordHash: u.password?.startsWith('$2'),
        passwordLength: u.password?.length,
        createdAt: u.createdAt
      }))
    };
  }
  */

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return this.usersService.findById(Number(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateProfile(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(Number(req.user.id), updateUserDto);
  }
}
