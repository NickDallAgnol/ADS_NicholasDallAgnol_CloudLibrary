// api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita o CORS para permitir requisições do nosso frontend
  app.enableCors(); // <-- ESSA É A LINHA DA SOLUÇÃO

  await app.listen(3000);
}
bootstrap();