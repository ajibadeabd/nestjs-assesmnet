import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './util/exceptions/http.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: false,
      forbidUnknownValues: false,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: false,
      validationError: { value: true },
      transform: true,
      exceptionFactory: (errors) => {
        throw new UnprocessableEntityException({
          message: 'invalid data provided',
          errors: errors
            .map(({ property, constraints }) => {
              const response: object = {};
              response[`${property}`] = Object.values(constraints);
              return response;
            })
            .reduce((a, v) => ({ ...a, ...v }), {}),
        });
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
