import { Controller, Get, Post, Body, Patch, Param, Delete, DefaultValuePipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindOrderByDateDTO } from './dto/find-order-by-date.dto';
import { BayarDTO } from './dto/bayar.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      return this.orderService.create(createOrderDto);
    } catch (error) {
      throw error
    }
  }

  @Post("/all-order")
  async findAll(@Body() findOrderByDateDTO: FindOrderByDateDTO) {
    try {
      return this.orderService.findAll(findOrderByDateDTO);
    } catch (error) {
      throw error
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return this.orderService.findOne(id);
    } catch (error) {
      throw error
    }
  }

  @Patch(':id/edit-order')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    try {
      return this.orderService.update(id, updateOrderDto);
    } catch (error) {
      throw error
    }
  }

  @Patch(':id/bayar-order')
  async bayar(@Param('id') id: string, @Body() bayarOrderDTO: BayarDTO) {
    try {
      return this.orderService.updateStatusBayar(id, bayarOrderDTO);
    } catch (error) {
      throw error
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return this.orderService.remove(id);
    } catch (error) {
      throw error
    }
  }
}
