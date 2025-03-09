import { Controller, Get, Query } from '@nestjs/common';
import { RouteService } from './route.service';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  /**
   * Пример запроса для расчёта маршрута.
   * Пример запроса в Postman:
   * GET http://localhost:3000/route?origin=55.7558,37.6176&destination=59.9343,30.3351
   */
  @Get()
  async calculateRoute(
    @Query('origin') origin: string,
    @Query('destination') destination: string,
  ) {
    return this.routeService.getRoute(origin, destination);
  }
}
