import { Module } from '@nestjs/common';
import { RiwayatTransaksiService } from './riwayat-transaksi.service';
import { RiwayatTransaksiController } from './riwayat-transaksi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiwayatTransaksi } from './entities/riwayatTransaksi.entitty';
import { Order } from 'src/order/entities/order.entity';
import { Menu } from 'src/menus/entities/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RiwayatTransaksi, Order, Menu])],
  controllers: [RiwayatTransaksiController],
  providers: [RiwayatTransaksiService],
})
export class RiwayatTransaksiModule { }
