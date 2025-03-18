import { RouteEntryDto } from './route-entry.dto';

export class ShipmentResultDto {
  description: string;
  routes: RouteEntryDto[] | null;
  error?: string;
}
