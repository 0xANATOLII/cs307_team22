import { Module } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { BadgeController } from './badge.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BadgeSchema } from './schema/badge.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Badge', schema: BadgeSchema}
    ])
  ],
  controllers: [BadgeController],
  providers: [BadgeService],
})
export class BadgeModule {}
