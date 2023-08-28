import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any).message ||
          (exception.getResponse() as any).stacktrace?.message ||
          (exception.getResponse() as any).stacktrace ||
          exception.message
        : 'An Error Occurred';

    const exeptionResponse = exception?.getResponse?.();
    const extraData =
      typeof exeptionResponse === 'object' ? exeptionResponse : {};

    return response.status(status).json({
      ...extraData,
      status: false,
      statusCode: status,
      message,
    });
  }
}
