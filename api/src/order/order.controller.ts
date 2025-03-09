import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { OrderService } from './order.service';
import { Prisma, OrderStatus } from '@prisma/client';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() data: Prisma.OrderCreateInput) {
    return this.orderService.createOrder(data);
  }

  @Get()
  async findAll() {
    return this.orderService.getOrders();
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
  ) {
    return this.orderService.updateOrderStatus(+id, status);
  }
}
