import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe, ParseIntPipe, Query } from '@nestjs/common';
import { MejaService } from './meja.service';
import { CreateMejaDto } from './dto/create-meja.dto';
import { UpdateMejaDto } from './dto/update-meja.dto';

@Controller('meja')
export class MejaController {
  constructor(private readonly mejaService: MejaService) { }

  @Post()
  async create(@Body() createMejaDto: CreateMejaDto) {
    try {
      return this.mejaService.create(createMejaDto);
    } catch (error) {
      throw error
    }
  }

  @Get()
  async findAll(
  ) {
    try {
      return this.mejaService.findAll();
    } catch (error) {
      throw error
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return this.mejaService.findOne(id);
    } catch (error) {
      throw error
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMejaDto: UpdateMejaDto) {
    try {
      return this.mejaService.update(id, updateMejaDto);
    } catch (error) {
      throw error
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return this.mejaService.remove(id);
    } catch (error) {
      throw error
    }
  }
}
