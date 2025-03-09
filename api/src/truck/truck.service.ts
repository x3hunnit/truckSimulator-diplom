import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Truck, Prisma } from '@prisma/client';

@Injectable()
export class TruckService {
  constructor(private readonly prisma: PrismaService) {}

  async createTruck(data: Prisma.TruckCreateInput): Promise<Truck> {
    return this.prisma.truck.create({ data });
  }

  async getAllTrucks(): Promise<Truck[]> {
    return this.prisma.truck.findMany();
  }
}
