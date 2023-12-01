import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Between, DataSource, Repository } from 'typeorm';
import { RiwayatTransaksi, JenisTransaksi } from './entities/riwayatTransaksi.entitty';
import { ResponseDto } from 'src/config/Response-dto';
import { Menu } from 'src/menus/entities/menu.entity';
import { RiwayatTransaksiDTO } from './dto/riwayatTransaksi.dto';
import { CreateTransaksiDTO } from './dto/createTransaksi.dto';

@Injectable()
export class RiwayatTransaksiService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,

        @InjectRepository(Menu)
        private menuRepository: Repository<Menu>,

        @InjectRepository(RiwayatTransaksi)
        private riwayatTransaksiRepository: Repository<RiwayatTransaksi>,

        private dataSource: DataSource
    ) { }

    async findBalanceToday(): Promise<ResponseDto<RiwayatTransaksi>> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const myBalance = await this.riwayatTransaksiRepository.find(
                {
                    order: { tanggalTransaksi: "DESC" },
                    select: ['TotalKas', 'idRiwayatTransaksi'], take: 1
                }
            )
            await queryRunner.commitTransaction();
            return { data: myBalance }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async getRiwayatTransaksi(filterRiwayatTransaksi: RiwayatTransaksiDTO): Promise<ResponseDto<RiwayatTransaksi>> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const allRiwayatTransaksi = await this.riwayatTransaksiRepository.find(
                {
                    where: {
                        tanggalTransaksi: Between(filterRiwayatTransaksi.tanggalAwal, filterRiwayatTransaksi.tanggalAkhir),
                        jenisTansaksi: filterRiwayatTransaksi.jenisTransaksi
                    },
                    order: { tanggalTransaksi: "ASC" },
                    relations: { idOrder: true }
                }
            )
            await queryRunner.commitTransaction();
            return { data: allRiwayatTransaksi }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }

    async createTransaksi(dataTransaksi: CreateTransaksiDTO): Promise<ResponseDto<RiwayatTransaksi>> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const transaksi = new RiwayatTransaksi()
            transaksi.jenisTansaksi = dataTransaksi.jenisTransaksi
            transaksi.keteranganTransaksi = dataTransaksi.KeteranganTransaksi
            transaksi.nilaiTransaksi = parseInt(dataTransaksi.nilaiTransaksi)

            let totalKas = await this.riwayatTransaksiRepository.find({ order: { tanggalTransaksi: "DESC" }, take: 1 })
            let newTransaksi: RiwayatTransaksi;

            if (dataTransaksi.jenisTransaksi === 'masuk') {
                transaksi.TotalKas = totalKas[0].TotalKas + parseInt(dataTransaksi.nilaiTransaksi)
                transaksi.tanggalTransaksi = new Date()
                newTransaksi = await this.riwayatTransaksiRepository.save(transaksi)
            } else if (dataTransaksi.jenisTransaksi === 'keluar') {
                transaksi.TotalKas = totalKas[0].TotalKas - parseInt(dataTransaksi.nilaiTransaksi)
                transaksi.tanggalTransaksi = new Date()
                newTransaksi = await this.riwayatTransaksiRepository.save(transaksi)
            }
            await queryRunner.commitTransaction();
            return { data: newTransaksi }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }
}
