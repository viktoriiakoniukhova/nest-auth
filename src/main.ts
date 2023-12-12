import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const frontendUrl = configService.get('FRONTEND_URL');

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  if (frontendUrl) {
    app.enableCors({
      origin: configService.get('FRONTEND_URL'),
      credentials: true,
    });
  }

  await app.listen(3000);
}
bootstrap();
