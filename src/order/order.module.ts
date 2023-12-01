import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Menu } from 'src/menus/entities/menu.entity';
import { Meja } from 'src/meja/entities/meja.entity';
import { OrderToMenu } from './entities/orderToMenu.entity';
import { RiwayatTransaksi } from 'src/riwayat-transaksi/entities/riwayatTransaksi.entitty';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Menu, Meja, OrderToMenu, RiwayatTransaksi])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
