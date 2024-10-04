import { Test, TestingModule } from '@nestjs/testing';
import { MonumentService } from './monument.service';

describe('MonumentService', () => {
  let service: MonumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonumentService],
    }).compile();

    service = module.get<MonumentService>(MonumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
