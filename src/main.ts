import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';


const env = require('dotenv');
env.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
  }));

  app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  }));
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
