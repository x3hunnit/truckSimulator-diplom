// src/app.module.ts
import { Module } from '@nestjs/common';
import { SimulationController } from './simulation.controller';
import { SimulationService } from './simulation.service';

@Module({
  imports: [],
  controllers: [SimulationController],
  providers: [SimulationService],
})
export class AppModule {}

