import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { DataSource, Like, Repository } from 'typeorm';
import { ResponseDto } from 'src/config/Response-dto';
import { PaginationQuery } from 'src/config/PaginationQuery';
import { NotFoundException } from 'src/config/NotFoundException';
import { ForbiddenException } from 'src/config/ForbiddenException';

@Injectable()
export class MenusService {

  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    private dataSource: DataSource
  ) { }

  async create(createMenuDto: CreateMenuDto, menuImage?: string): Promise<ResponseDto<Menu>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const menu = new Menu();

      menu.menuName = createMenuDto.menuName;
      menu.harga = parseInt(createMenuDto.harga);
      menu.stokHarian = parseInt(createMenuDto.stokHarian);
      menu.defaultStokHarian = parseInt(createMenuDto.defaultStokHarian);
      menu.menuImage = menuImage
      if(createMenuDto.isDefaultStokActive === 'true'){
        menu.isDefaultStokActive = true
      }else if(createMenuDto.isDefaultStokActive === 'false'){
        menu.isDefaultStokActive = false
      }

      const menuCreate = await this.menuRepository.save(menu)
      await queryRunner.commitTransaction();

      return { data: menuCreate };
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

  async findAll(page: number, limit: number, searchMenu: string): Promise<ResponseDto<Menu>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!searchMenu) {
        const [menu, total] = await this.menuRepository.findAndCount(
          {
            skip: (page - 1) * limit,
            take: limit,
            order: { menuName: "ASC" }
          }
        )
        await queryRunner.commitTransaction();
        return {
          data: menu,
          totalElement: total,
          currentPage: page,
          limit: limit,
          totalPage: total === 1 ? 1 : Math.ceil(total / limit)
        }
      } else {
        const [menu, total] = await this.menuRepository.findAndCount(
          {
            skip: (page - 1) * limit,
            take: limit,
            where: { menuName: Like(`%${searchMenu}%`) },
            order: { menuName: "ASC" }
          }
        )
        await queryRunner.commitTransaction();
        return {
          data: menu,
          totalElement: total,
          currentPage: page,
          limit: limit,
          totalPage: total === 1 ? 1 : Math.ceil(total / limit)
        }
      }

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: string): Promise<ResponseDto<Menu>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const menu = await this.menuRepository.findOne({ where: { idMenu: id } })

      if (!menu) {
        throw new NotFoundException()
      }

      await queryRunner.commitTransaction();
      return { data: menu }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, updateMenuDto: UpdateMenuDto, menuImage?: string): Promise<ResponseDto<Menu>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let menu = await this.menuRepository.findOne({ where: { idMenu: id } })

      if (!menu) {
        throw new NotFoundException()
      }

      menu.menuName = updateMenuDto.menuName ? updateMenuDto.menuName : menu.menuName
      menu.harga = updateMenuDto.harga ? parseInt(updateMenuDto.harga) : menu.harga
      menu.defaultStokHarian = updateMenuDto.defaultStokHarian ? parseInt(updateMenuDto.defaultStokHarian) : menu.defaultStokHarian
      menu.stokHarian = updateMenuDto.stokHarian ? parseInt(updateMenuDto.stokHarian) : menu.stokHarian
      menu.menuImage = menuImage
      if(updateMenuDto.isDefaultStokActive === 'true'){
        menu.isDefaultStokActive = true
      }else if(updateMenuDto.isDefaultStokActive === 'false'){
        menu.isDefaultStokActive = false
      }

      menu = await this.menuRepository.save(menu)
      await queryRunner.commitTransaction();

      return { data: menu }

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

  async remove(id: string): Promise<ResponseDto<string>> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const findMenuById = await this.menuRepository.findOneBy({ idMenu: id })

      if (!findMenuById) {
        throw new NotFoundException()
      }

      await this.menuRepository.remove(findMenuById)
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
