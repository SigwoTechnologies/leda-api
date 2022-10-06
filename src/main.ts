import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const version = 'v1';

  app.enableCors();
  app.setGlobalPrefix(version);

  const port = process.env.PORT || 3333;

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + version);
  });
}
bootstrap();
