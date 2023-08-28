import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './util/exceptions/http.exception';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
console.log(process.env.RABBIT_MQ_HOSTS);

dotenv.config();
console.log(process.env.RABBIT_MQ_HOSTS);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ_HOSTS],
      queue: 'salla_billing_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

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
  const conf = new DocumentBuilder()
    .setTitle('Billing/Plan services ')
    .setDescription('API Documentation for Billing')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, conf);
  SwaggerModule.setup('', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.startAllMicroservices(); // Start listening to the microservice
  // await app.list(); // Start listening to the microservice

  await app.listen(3000);
}
bootstrap();
