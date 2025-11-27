import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Função principal de inicialização da API
 * Configura CORS, validações, Swagger e inicia o servidor
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 3000;

  // Habilita CORS para permitir requisições do frontend
  app.enableCors();

  // Configura validação automática dos DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Cloud Library API')
    .setDescription('Documentação da API Cloud Library')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();
