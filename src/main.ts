import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/exceptions/filters/global-exception.filter';
import { ValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const version = 'v1';

  app.enableCors();
  app.setGlobalPrefix(version);
  app.useGlobalPipes(new ValidationPipe());

  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(adapterHost));

  const port = process.env.PORT || 3334;

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + version);
  });
}
bootstrap();
