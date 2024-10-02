import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true, //This gets our .env file to make it global
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:(configService: ConfigService) =>({
        uri: configService.get<string>('MONGO_CONNECT'),
      }),
    }),
  ],



  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
