import { Test, TestingModule } from '@nestjs/testing';
import { RiwayatTransaksiService } from './riwayat-transaksi.service';

describe('RiwayatTransaksiService', () => {
  let service: RiwayatTransaksiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiwayatTransaksiService],
    }).compile();

    service = module.get<RiwayatTransaksiService>(RiwayatTransaksiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
