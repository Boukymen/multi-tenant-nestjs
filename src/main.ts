import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './util/setup-swagger';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, validateCustomDecorators: true }),
  );
  setupSwagger(app);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(9000);
}

bootstrap();

// https://levelup.gitconnected.com/nestjs-multiple-db-setup-with-typeorm-a78cb05a085
// https://github.com/thomasvds/nestjs-multitenants/blob/master/src/modules/tenancy/tenancy.utils.ts

// https://stackoverflow.com/questions/56085705/how-can-i-setup-multitenant-in-nestjs
