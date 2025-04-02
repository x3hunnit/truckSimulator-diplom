// src/simulation.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { ShipmentDto } from './dtos/shipment.dto';
import { ShipmentResultDto } from './dtos/shipment-result.dto';

@Controller('simulate')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post()
  async simulate(@Body() shipments: ShipmentDto[]): Promise<ShipmentResultDto[]> {
    return this.simulationService.simulateShipments(shipments);
  }
}
