// api/src/users/users.module.ts (Este é o módulo específico de Usuários)
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity'; // Certifique-se que o caminho da entidade está correto
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exportamos o UsersService para ser usado em outros módulos (como AuthModule)
})
export class UsersModule {}