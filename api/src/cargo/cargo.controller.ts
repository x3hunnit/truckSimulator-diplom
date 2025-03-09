import { Controller, Post, Get, Body } from '@nestjs/common';
import { CargoService } from './cargo.service';
import { Prisma } from '@prisma/client';

@Controller('cargo')
export class CargoController {
    constructor(private readonly cargoService: CargoService) {}

    @Post()
    async create(@Body() data: Prisma.CargoCreateInput) {
        return this.cargoService.createCargo(data);
    }

    @Get()
    async findAll() {
        return this.cargoService.getAllCargoes();
    }
}
