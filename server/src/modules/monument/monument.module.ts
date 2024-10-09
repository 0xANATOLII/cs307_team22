import { Module } from '@nestjs/common';
import { MonumentService } from './monument.service';
import { MonumentController } from './monument.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MonumentSchema } from './schema/monument.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Monument', schema: MonumentSchema}
    ])
  ],
  controllers: [MonumentController],
  providers: [MonumentService],
})
export class MonumentModule {}
