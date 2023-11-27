import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import * as process from 'process';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${process.env.RMQ_HOST}:5672`],
        queue: 'gpt_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) =>
        new RpcException(
          `validation error: ${JSON.stringify(errors.map((e) => e.value))}`,
        ),
    }),
  );
  await app.listen();
}
bootstrap();
