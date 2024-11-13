import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://192.168.1.9:3000',
    credentials: true
  })
  app.use(cookieParser());
  await app.listen(3002, '192.168.1.10');
}
bootstrap();
