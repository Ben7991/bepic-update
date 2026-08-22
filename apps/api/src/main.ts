import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: ['http://localhost:5173'],
    },
  });
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/health', method: RequestMethod.GET }],
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser());

  const configService = app.get<ConfigService>(ConfigService);
  const PORT = configService.get<string>('PORT');

  const config = new DocumentBuilder()
    .setTitle('Bepic')
    .setDescription('A network marketing service')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT ?? 8000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
