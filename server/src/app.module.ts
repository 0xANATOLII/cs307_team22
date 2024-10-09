import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { Monument } from './modules/monument/schema/monument.schema';
import { MonumentModule } from './modules/monument/monument.module';
import { BadgeModule } from './modules/badge/badge.module';



@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: '.env'}),
    MongooseModule.forRoot(process.env.MONGO_CONNECT),
    UserModule,
    BadgeModule,
    MonumentModule,
  ],



  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
