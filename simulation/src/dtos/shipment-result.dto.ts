// src/dtos/shipment-result.dto.ts
import { RouteEntryDto } from './route-entry.dto';

export class ShipmentResultDto {
  description: string;
  routes: RouteEntryDto[] | null;
  error?: string;
}

