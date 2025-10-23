import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = request;
    
    this.logger.log(`Incoming Request: ${method} ${url}`);
    this.logger.log(`Body: ${JSON.stringify(body)}`);
    this.logger.log(`Headers: ${JSON.stringify(headers, null, 2)}`);

    return next.handle().pipe(
      catchError((error) => {
        this.logger.error(`Error in ${method} ${url}:`);
        this.logger.error(`Error message: ${error.message}`);
        this.logger.error(`Error stack: ${error.stack}`);
        
        if (error.response) {
          this.logger.error(`Error response: ${JSON.stringify(error.response)}`);
        }
        
        throw error;
      }),
    );
  }
}