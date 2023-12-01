import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Between, DataSource, Repository } from 'typeorm';
import { ResponseDto } from 'src/config/Response-dto';
import { ForbiddenException } from 'src/config/ForbiddenException';
import { Menu } from 'src/menus/entities/menu.entity';
import { Meja } from 'src/meja/entities/meja.entity';
import { OrderToMenu } from './entities/orderToMenu.entity';
import { FindOrderByDateDTO } from './dto/find-order-by-date.dto';
import { BayarDTO } from './dto/bayar.dto';
import { RiwayatTransaksi } from 'src/riwayat-transaksi/entities/riwayatTransaksi.entitty';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,

    @InjectRepository(Meja)
    private mejaRepository: Repository<Meja>,

    @InjectRepository(OrderToMenu)
    private orderToMenuRepository: Repository<OrderToMenu>,

    @InjectRepository(RiwayatTransaksi)
    private riwayatTransaksiRepository: Repository<RiwayatTransaksi>,

    private dataSource: DataSource
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<ResponseDto<Order>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      const meja = await this.mejaRepository.findOne({ where: { idMeja: createOrderDto.meja } })
      const noAntrian = await this.orderRepository.find(
        {
          where: { tanggalDatang: Between(todayStart, todayEnd) },
          order: { tanggalDatang: "DESC" },
          take: 1
        }
      )

      const dataOrder = new Order()
      dataOrder.catatan = createOrderDto.catatan
      dataOrder.meja = meja
      dataOrder.nomerAntrian = noAntrian.length > 0 ? noAntrian[0].nomerAntrian + 1 : 1
      dataOrder.tanggalDatang = new Date()
      let order = await this.orderRepository.save(dataOrder)

      for (let i = 0; i < createOrderDto.listMenu.length; i++) {
        const menu = await this.menuRepository.findOne({ where: { idMenu: createOrderDto.listMenu[i].menuId } })
        const tes = new OrderToMenu()
        tes.orderMenu = order
        tes.jumlahPesanan = createOrderDto.listMenu[i].jumlahPesanan
        tes.menu = menu
        await this.orderToMenuRepository.save(tes)
      }

      await queryRunner.commitTransaction();

      return { data: order }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === "ER_DUP_ENTRY") {
        throw new ForbiddenException(error.sqlMessage)
      }
      throw error
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(findOrderByDateDTO: FindOrderByDateDTO): Promise<ResponseDto<Order[]>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const allOrder = await this.orderRepository
        .createQueryBuilder('order')
        .innerJoinAndSelect('order.meja', 'meja')
        .innerJoinAndSelect('order.orderToMenu', 'orderToMenu')
        .innerJoinAndSelect('orderToMenu.menu', 'menu')
        .where(
          {
            tanggalDatang: Between(new Date(findOrderByDateDTO.todayStart), new Date(findOrderByDateDTO.todayEnd)),
            isPaid: findOrderByDateDTO.isPaid
          })
        .orderBy('order.tanggalDatang', "ASC")
        .getMany()

      await queryRunner.commitTransaction();

      return { data: allOrder }
    } catch (error) {
      throw error
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: string): Promise<ResponseDto<Order>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.orderRepository
        .createQueryBuilder('order')
        .innerJoinAndSelect('order.meja', 'meja')
        .innerJoinAndSelect('order.orderToMenu', 'orderToMenu')
        .innerJoinAndSelect('orderToMenu.menu', 'menu')
        .where(
          {
            idOrder: id
          })
        .getOne()
      await queryRunner.commitTransaction();
      return { data: order }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<ResponseDto<Order>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let myOrder = await this.orderRepository.findOneBy({ idOrder: id })
      for (let i = 0; i < updateOrderDto.listMenu.length; i++) {
        const findMenuOrder = await this.orderToMenuRepository.findOne(
          {
            where:
            {
              orderMenu: { idOrder: id },
              menu: { idMenu: updateOrderDto.listMenu[i].menuId }
            }
          }
        )

        if (findMenuOrder) {
          await this.orderToMenuRepository.update(findMenuOrder.idOrderToMenu, { jumlahPesanan: updateOrderDto.listMenu[i].jumlahPesanan })
        } else {
          const newMenu = new OrderToMenu()
          newMenu.jumlahPesanan = updateOrderDto.listMenu[i].jumlahPesanan
          newMenu.orderMenu = myOrder
          newMenu.menu = await this.menuRepository.findOneBy({ idMenu: updateOrderDto.listMenu[i].menuId })

          await this.orderToMenuRepository.save(newMenu)
        }
      }

      await this.orderRepository.update(id, { catatan: updateOrderDto.catatan, meja: { idMeja: updateOrderDto.meja } })

      await queryRunner.commitTransaction();
      return { data: new Order() }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === "ER_DUP_ENTRY") {
        throw new ForbiddenException(error.sqlMessage)
      }
      throw error
    } finally {
      await queryRunner.release();
    }
  }

  async updateStatusBayar(id: string, totalBayar: BayarDTO): Promise<ResponseDto<String>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const myOrder = await this.orderRepository
        .createQueryBuilder('order')
        .innerJoinAndSelect('order.meja', 'meja')
        .innerJoinAndSelect('order.orderToMenu', 'orderToMenu')
        .innerJoinAndSelect('orderToMenu.menu', 'menu')
        .where({ idOrder: id })
        .getOne()

      let totalBelanja: number = 0
      for (let i = 0; i < myOrder.orderToMenu.length; i++) {
        totalBelanja += (myOrder.orderToMenu[i].jumlahPesanan * myOrder.orderToMenu[i].menu.harga)
      }

      if (totalBayar.jumlahBayar >= totalBelanja) {
        await this.orderRepository.update(id, { isPaid: true })
        let totalKas = await this.riwayatTransaksiRepository.find({ order: { tanggalTransaksi: "DESC" }, take: 1 })
        await this.riwayatTransaksiRepository.save(
          {
            tanggalTransaksi: new Date(),
            nilaiTransaksi: totalBelanja,
            TotalKas: (totalKas.length ? totalKas[0].TotalKas + totalBelanja : totalBelanja),
            idOrder: myOrder
          }
        )
      } else {
        throw new Error("Pembayaran Kurang")
      }
      await queryRunner.commitTransaction();
      return { data: "Pembayaran Berhasil" }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === "ER_DUP_ENTRY") {
        throw new ForbiddenException(error.sqlMessage)
      } else if (error.code === "Pembayaran Kurang") {
        throw new ForbiddenException(error.message)
      }
      throw error
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<ResponseDto<string>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const myOrder = await this.orderRepository.findOneBy({ idOrder: id })
      const allMenuOrder = await this.orderToMenuRepository.findBy({ orderMenu: { idOrder: id } })

      await this.orderToMenuRepository.remove(allMenuOrder)
      await this.orderRepository.remove(myOrder)
      await queryRunner.commitTransaction();
      return { data: `Delete Success` };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error
    } finally {
      await queryRunner.release();
    }
  }
}
