import { Body, Controller, Post } from '@nestjs/common';
import { ShipmentDto } from './dtos/shipment.dto';
import { SimulationService } from './simulation.service';
import { ShipmentResultDto } from './dtos/shipment-result.dto';

@Controller('simulate')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post()
  async simulate(
    @Body() shipments: ShipmentDto[],
  ): Promise<ShipmentResultDto[]> {
    return this.simulationService.simulateShipments(shipments);
  }
}
