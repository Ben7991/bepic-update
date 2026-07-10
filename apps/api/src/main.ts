import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RequestMethod } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.setGlobalPrefix('api', {
    exclude: [
      {method: RequestMethod.GET, path: '/health'}
    ],
  });

  const configService: ConfigService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') ?? 8000;

  const config = new DocumentBuilder()
    .setTitle('Bepic API')
    .setDescription('The Bepic API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(PORT);
}
bootstrap();
