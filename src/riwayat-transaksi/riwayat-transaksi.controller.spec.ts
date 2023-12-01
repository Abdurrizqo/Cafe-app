import { Test, TestingModule } from '@nestjs/testing';
import { RiwayatTransaksiController } from './riwayat-transaksi.controller';
import { RiwayatTransaksiService } from './riwayat-transaksi.service';

describe('RiwayatTransaksiController', () => {
  let controller: RiwayatTransaksiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiwayatTransaksiController],
      providers: [RiwayatTransaksiService],
    }).compile();

    controller = module.get<RiwayatTransaksiController>(RiwayatTransaksiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
