import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true
  })
  await app.listen(3002);
}
// bootstrap();
if (require.main === module) {
  bootstrap();
}

export const handler = async (event, context) => {
  const app = await NestFactory.create(AppModule);
  return app.listen(3000, () => console.log('Server is running...'));
}