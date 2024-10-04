import { Test, TestingModule } from '@nestjs/testing';
import { MonumentController } from './monument.controller';
import { MonumentService } from './monument.service';

describe('MonumentController', () => {
  let controller: MonumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonumentController],
      providers: [MonumentService],
    }).compile();

    controller = module.get<MonumentController>(MonumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
