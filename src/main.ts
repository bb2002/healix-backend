import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    ['/docs'],
    expressBasicAuth({
      challenge: true,
      users: {
        healix: process.env.SWAGGER_PASS,
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Healix API')
    .setDescription('Healix API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(8080);
}
bootstrap();
