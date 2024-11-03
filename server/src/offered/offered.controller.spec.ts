import { Test, TestingModule } from '@nestjs/testing';
import { OfferedController } from './offered.controller';

describe('OfferedController', () => {
  let controller: OfferedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferedController],
    }).compile();

    controller = module.get<OfferedController>(OfferedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
