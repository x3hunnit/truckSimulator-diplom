import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Driver } from '@prisma/client';

@Injectable()
export class DriverService {
  constructor(private readonly prisma: PrismaService) {}

  async createDriver(data: Prisma.DriverCreateInput): Promise<Driver> {
    return this.prisma.driver.create({ data });
  }

  async getDrivers(): Promise<Driver[]> {
    return this.prisma.driver.findMany();
  }
}
