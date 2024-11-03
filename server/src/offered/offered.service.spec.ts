import { Test, TestingModule } from '@nestjs/testing';
import { OfferedService } from './offered.service';

describe('OfferedService', () => {
  let service: OfferedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfferedService],
    }).compile();

    service = module.get<OfferedService>(OfferedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
