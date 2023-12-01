import { Injectable } from '@nestjs/common';
import { CreateMejaDto } from './dto/create-meja.dto';
import { UpdateMejaDto } from './dto/update-meja.dto';
import { ResponseDto } from 'src/config/Response-dto';
import { Meja } from './entities/meja.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ForbiddenException } from 'src/config/ForbiddenException';
import { NotFoundException } from 'src/config/NotFoundException';

@Injectable()
export class MejaService {
  constructor(
    @InjectRepository(Meja)
    private mejaRepository: Repository<Meja>,
    private dataSource: DataSource
  ) { }

  async create(createMejaDto: CreateMejaDto): Promise<ResponseDto<Meja>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const meja = await this.mejaRepository.save(createMejaDto)
      await queryRunner.commitTransaction();

      return { data: meja }
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

  async findAll(): Promise<ResponseDto<Meja>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const [meja, total] = await this.mejaRepository.findAndCount({ order: { namaMeja: "ASC" } })
      await queryRunner.commitTransaction();

      return {
        data: meja,
        totalElement: total,
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: string): Promise<ResponseDto<Meja>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const meja = await this.mejaRepository.findOne({ where: { idMeja: id } })
      await queryRunner.commitTransaction();

      if (!meja) {
        throw new NotFoundException()
      }

      return { data: meja }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, updateMejaDto: UpdateMejaDto): Promise<ResponseDto<Meja>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let meja = await this.mejaRepository.findOne({ where: { idMeja: id } })

      if (!meja) {
        throw new NotFoundException()
      }

      meja.namaMeja = updateMejaDto.namaMeja ? updateMejaDto.namaMeja : meja.namaMeja

      meja = await this.mejaRepository.save(meja)

      await queryRunner.commitTransaction();
      return { data: meja }
    } catch (error) {
      await queryRunner.rollbackTransaction();
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
      let meja = await this.mejaRepository.findOneBy({ idMeja: id })

      if (!meja) {
        throw new NotFoundException()
      }

      meja = await this.mejaRepository.remove(meja)
      await queryRunner.commitTransaction();

      return { data: "delete success" }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error
    } finally {
      await queryRunner.release();
    }
  }
}
