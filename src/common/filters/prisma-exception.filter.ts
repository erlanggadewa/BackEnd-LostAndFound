import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let data: any = {};

    // Resource not found
    if (exception.code === 'P2025') {
      data = {
        statusCode: 404,
        message: 'Record not found',
        error: 'Not Found',
      };
    } else {
      data = {
        statusCode: 500,
        message: exception.message,
        error: exception.code,
      };
    }

    response.status(data.statusCode | 500).json(data);
  }
}
