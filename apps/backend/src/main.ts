import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat/chat.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
