import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserSchema } from './schema/user.schema';
import { UserController } from './user.controller';
import { MailModule } from '../mail/mail.module';
import { BadgeModule } from '../badge/badge.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Register User schema with Mongoose
    BadgeModule,
    MailModule,
    
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule], // Export MongooseModule to make UserModel accessible in other modules
})
export class UserModule {}
