// api/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt'; // Certifique-se que JwtModule está importado
import { ConfigModule, ConfigService } from '@nestjs/config'; // Certifique-se que ConfigModule e ConfigService estão importados
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // **Este bloco é crucial para o JWT_SECRET**
    JwtModule.registerAsync({
      imports: [ConfigModule], // Precisa importar o ConfigModule aqui também
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')!, // Usar ! para garantir que é string
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService], // Dizer ao NestJS para injetar o ConfigService
    }),
    // Não é necessário importar ConfigModule aqui se já é global
    // mas é boa prática para clareza em módulos que dependem dele fortemente.
    // ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // Exporte AuthService caso precise ser usado em outros módulos
})
export class AuthModule {}