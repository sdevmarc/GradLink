import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

const HOST = process.env.HOST || 'http://localhost:80'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: HOST,
    credentials: true
  })
  await app.listen(3002);
}

bootstrap()
