import { Controller, Post, Get, Body } from '@nestjs/common';
import { TruckService } from './truck.service';
import { Prisma } from '@prisma/client';

@Controller('truck')
export class TruckController {
  constructor(private readonly truckService: TruckService) {}

  @Post()
  async create(@Body() data: Prisma.TruckCreateInput) {
    return this.truckService.createTruck(data);
  }

  @Get()
  async findAll() {
    return this.truckService.getAllTrucks();
  }
}
