import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { MonumentModule } from './modules/monument/monument.module';
import { BadgeModule } from './modules/badge/badge.module';
import { AuthModule } from './modules/auth/auth.module'; // Import AuthModule

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGO_CONNECT),
    UserModule,
    BadgeModule,
    MonumentModule,
    AuthModule, // Import AuthModule for authentication
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
