import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { BpmnToolAppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(BpmnToolAppModule);
  const configService = app.get(ConfigService);

  app.useBodyParser('json', { limit: '50mb' });
  app.useGlobalPipes(new ValidationPipe());

  if (configService.getOrThrow<string>('env') === 'development') {
    app.enableCors();
  }

  await app.listen(configService.getOrThrow<number>('port'));
}
bootstrap();
