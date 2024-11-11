import { forwardRef, Module } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { BadgeController } from './badge.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BadgeSchema } from './schema/badge.schema';
import { UserModule } from '../user/user.module'; // Import UserModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Badge', schema: BadgeSchema }]),
    forwardRef(()=>UserModule),  // Import UserModule to access UserModel
  ],
  controllers: [BadgeController],
  providers: [BadgeService],
  exports:[BadgeModule,MongooseModule]
})
export class BadgeModule {}
