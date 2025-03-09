import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Order, OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({ data });
  }

  async getOrders(): Promise<Order[]> {
    return this.prisma.order.findMany();
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
