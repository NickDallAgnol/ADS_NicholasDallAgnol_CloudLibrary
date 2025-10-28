import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 3000;

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não esperadas
      forbidNonWhitelisted: true, // Gera erro se vier algo fora do DTO
      transform: true, // Converte tipos automaticamente (ex: string → number)
    }),
  );

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
