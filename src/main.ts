import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  // Middleware para garantir JSON parsing
  app.use((req, res, next) => {
    if (req.headers['content-type'] && req.headers['content-type'].includes('text/plain')) {
      req.headers['content-type'] = 'application/json';
    }
    next();
  });

  // Configure interceptors globalmente
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Configure ValidationPipe globalmente
  app.useGlobalPipes(new ValidationPipe({
    whitelist: false, // Temporariamente desabilitado para debug
    forbidNonWhitelisted: false, // Temporariamente desabilitado para debug
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  const config = new DocumentBuilder()
    .setTitle('Presente API')
    .setDescription('API para gerenciamento de presentes e eventos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();
