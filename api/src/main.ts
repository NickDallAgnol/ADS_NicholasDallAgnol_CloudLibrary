// api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 1. IMPORTE O ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // 2. ATIVE O PIPE DE VALIDAÇÃO GLOBALMENTE
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();