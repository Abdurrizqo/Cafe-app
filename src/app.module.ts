import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express/multer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenusModule } from './menus/menus.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Menu } from './menus/entities/menu.entity';
import { MejaModule } from './meja/meja.module';
import { OrderModule } from './order/order.module';
import { Meja } from './meja/entities/meja.entity';
import { Order } from './order/entities/order.entity';
import { OrderToMenu } from './order/entities/orderToMenu.entity';
import { RiwayatTransaksiModule } from './riwayat-transaksi/riwayat-transaksi.module';
import { RiwayatTransaksi } from './riwayat-transaksi/entities/riwayatTransaksi.entitty';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Menu, Meja, Order, OrderToMenu, RiwayatTransaksi],
    synchronize: true,
  }), MulterModule.register({
    dest: "./files"
  }), MenusModule, MejaModule, OrderModule, RiwayatTransaksiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
