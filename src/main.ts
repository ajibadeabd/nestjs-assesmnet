import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './util/exceptions/http.exception';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

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
    .addBearerAuth()
    .setTitle('Billing/Plan services ')
    .setDescription('API Documentation for Billing')
    .setVersion('0.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, conf);

  SwaggerModule.setup('/swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      customCssUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
      ],
    },
  });
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    const pathToSwaggerStaticFolder = resolve(process.cwd(), 'swagger-static');

    // write swagger json file
    const pathToSwaggerJson = resolve(
      pathToSwaggerStaticFolder,
      'swagger.json',
    );
    const swaggerJson = JSON.stringify(document, null, 2);
    writeFileSync(pathToSwaggerJson, swaggerJson);
    console.log(`Swagger JSON file written to: '/swagger-static/swagger.json'`);
  }
  await app.startAllMicroservices(); // Start listening to the microservice
  // await app.list(); // Start listening to the microservice

  await app.listen(3000);
}
bootstrap();
