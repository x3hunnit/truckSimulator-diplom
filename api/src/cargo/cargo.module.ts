import { Module } from '@nestjs/common';
import { CargoService } from './cargo.service';
import { CargoController } from './cargo.controller';
import  { PrismaModule } from '../../prisma/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [CargoService],
  controllers: [CargoController]
})
export class CargoModule {}
