import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { MailService } from '../mail/mail.service';

@Module({
  imports:[
    JwtModule.registerAsync({
      global:true,
      useFactory:(config:ConfigService)=>({
        secret:process.env.JWT_SECRET,
        signOptions:{expiresIn:'1h'}
      }),
      inject:[ConfigService],
    }),
    UserModule,
    
  ],
  controllers: [AuthController],
  providers: [AuthService,MailService],






})
export class AuthModule {}
