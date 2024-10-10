import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000; // You can change the port here

  app.enableCors({
    origin: 'http://localhost:8081', // allow your React Native app's origin
    methods: 'GET,POST,PATCH,DELETE', // allow specific HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // allow specific headers
  });

  await app.listen(port);
  // Ensure proper cleanup when the app is stopped
  process.on('SIGINT', async () => {
    await app.close();
    process.exit(0);
  });
}
bootstrap();
