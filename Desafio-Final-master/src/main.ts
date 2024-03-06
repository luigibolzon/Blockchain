import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  app.enableCors();
  app.setGlobalPrefix('api/v1');

  app.use(
    rateLimit({
      windowMs: 1 * 60 * 100, // 10 minutes
      max: 1000, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
      skipSuccessfulRequests: false, // The counting will skip all successful requests and just count the errors. Instead of removing rate-limiting, it's better to set this to true to limit the number of times a request fails. Can help prevent against brute-force attacks
      message: { message: 'Too Many requests', statusCode: 403 },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Blockchain Service')
    .setDescription('Serviço de conexão com a blockchain')
    .setVersion('1.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
