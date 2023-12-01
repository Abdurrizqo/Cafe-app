import { Body, Controller, Get, Post } from '@nestjs/common';
import { RiwayatTransaksiService } from './riwayat-transaksi.service';
import { RiwayatTransaksiDTO } from './dto/riwayatTransaksi.dto';
import { } from './entities/riwayatTransaksi.entitty';
import { CreateTransaksiDTO } from './dto/createTransaksi.dto';

@Controller('riwayat-transaksi')
export class RiwayatTransaksiController {
  constructor(private readonly riwayatTransaksiService: RiwayatTransaksiService) { }

  @Get()
  async balance() {
    try {
      return this.riwayatTransaksiService.findBalanceToday()
    } catch (error) {
      throw error
    }
  }

  @Post('list')
  async riwayatTransaksi(@Body() filterRiwayatTransaksi: RiwayatTransaksiDTO) {
    try {
      return this.riwayatTransaksiService.getRiwayatTransaksi(filterRiwayatTransaksi)
    } catch (error) {
      throw error
    }
  }

  @Post()
  async create(@Body() dataTransaksi: CreateTransaksiDTO) {
    try {
      return this.riwayatTransaksiService.createTransaksi(dataTransaksi)
    } catch (error) {
      throw error
    }
  }
}
