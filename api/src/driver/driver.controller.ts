import { Controller, Post, Get, Body } from '@nestjs/common';
import { DriverService } from './driver.service';
import { Prisma } from '@prisma/client';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  async create(@Body() data: Prisma.DriverCreateInput) {
    return this.driverService.createDriver(data);
  }

  @Get()
  async findAll() {
    return this.driverService.getDrivers();
  }
}
