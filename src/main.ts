import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './swagger.config';
import { SessionOptions } from 'passport';
import * as session from 'express-session';
import { Sentry } from 'src/sentry.config'; // Import the Sentry configuration file
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';


async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule,new ExpressAdapter(server));
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, authorization headers)
  });
 // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api',app, document);
  app.use(
    session({
      secret: 'asiodasjoddjdoasddasoidjasiodasdjaiodd',
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );
  // Add Sentry middleware
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.errorHandler());

  await app.listen(3001);
  console.log('NestJS application is running on http://localhost:3001');
}

bootstrap();
