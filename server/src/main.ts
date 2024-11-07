import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  // Increase the body size limit to 10MB
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  const port = process.env.PORT || 3000; // You can change the port here
  console.log("PORT++++++++++++++++++++++"+port)
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
