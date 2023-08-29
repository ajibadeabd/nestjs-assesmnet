"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appmodule = require("./app.module");
const _common = require("@nestjs/common");
const _httpexception = require("./util/exceptions/http.exception");
const _swagger = require("@nestjs/swagger");
const _microservices = require("@nestjs/microservices");
const _path = require("path");
const _fs = require("fs");
async function bootstrap() {
    const app = await _core.NestFactory.create(_appmodule.AppModule);
    app.useGlobalFilters(new _httpexception.HttpExceptionFilter());
    app.connectMicroservice({
        transport: _microservices.Transport.RMQ,
        options: {
            urls: [
                process.env.RABBIT_MQ_HOSTS
            ],
            queue: 'salla_billing_queue',
            queueOptions: {
                durable: false
            }
        }
    });
    app.useGlobalPipes(new _common.ValidationPipe({
        forbidNonWhitelisted: false,
        forbidUnknownValues: false,
        transformOptions: {
            enableImplicitConversion: true
        },
        disableErrorMessages: false,
        validationError: {
            value: true
        },
        transform: true,
        exceptionFactory: (errors)=>{
            throw new _common.UnprocessableEntityException({
                message: 'invalid data provided',
                errors: errors.map(({ property, constraints })=>{
                    const response = {};
                    response[`${property}`] = Object.values(constraints);
                    return response;
                }).reduce((a, v)=>({
                        ...a,
                        ...v
                    }), {})
            });
        }
    }));
    const conf = new _swagger.DocumentBuilder().addBearerAuth().setTitle('Billing/Plan services ').setDescription('API Documentation for Billing').setVersion('0.1.0').build();
    const document = _swagger.SwaggerModule.createDocument(app, conf);
    _swagger.SwaggerModule.setup('/swagger', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
            customJs: [
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'
            ]
        }
    });
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
        const pathToSwaggerStaticFolder = (0, _path.resolve)(process.cwd(), 'swagger-static');
        // write swagger json file
        const pathToSwaggerJson = (0, _path.resolve)(pathToSwaggerStaticFolder, 'swagger.json');
        const swaggerJson = JSON.stringify(document, null, 2);
        (0, _fs.writeFileSync)(pathToSwaggerJson, swaggerJson);
        console.log(`Swagger JSON file written to: '/swagger-static/swagger.json'`);
    }
    await app.startAllMicroservices(); // Start listening to the microservice
    // await app.list(); // Start listening to the microservice
    await app.listen(3000);
}
bootstrap();
