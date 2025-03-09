import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Cargo } from '@prisma/client';

@Injectable()
export class CargoService {
    constructor(private prisma: PrismaService) {}

    async createCargo(data: Prisma.CargoCreateInput): Promise<Cargo> {
        return this.prisma.cargo.create({ data });
    }

    async getAllCargoes(): Promise<Cargo[]> {
        return this.prisma.cargo.findMany();
    }
}
