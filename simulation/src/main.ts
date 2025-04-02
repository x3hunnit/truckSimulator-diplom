
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // включаем CORS
  await app.listen(8080);
  console.log('Сервер запущен на порту 8080');
}
bootstrap();
