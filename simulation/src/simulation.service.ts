import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ShipmentDto } from './dtos/shipment.dto';
import { ShipmentResultDto } from './dtos/shipment-result.dto';
import { RouteEntryDto } from './dtos/route-entry.dto';

@Injectable()
export class SimulationService {
  // Локальный OSRM сервер
  private readonly OSRM_API_URL = 'http://localhost:5001/route/v1/driving';

  async simulateShipment(shipment: ShipmentDto): Promise<ShipmentResultDto> {
    const { originLat, originLon, destLat, destLon, description } = shipment;

    // Формируем URL с нужными параметрами
    const url =
      `${this.OSRM_API_URL}/${originLon},${originLat};${destLon},${destLat}` +
      '?overview=full&alternatives=3&geometries=geojson';

    try {
      const response = await axios.get(url);
      const osrmData = response.data;

      if (
        osrmData.code !== 'Ok' ||
        !osrmData.routes ||
        osrmData.routes.length === 0
      ) {
        return { description, routes: null, error: 'Маршрут не найден' };
      }

      const routes: RouteEntryDto[] = osrmData.routes.map((route: any) => ({
        distanceKM: route.distance / 1000,
        durationMin: route.duration / 60,
        geometry: route.geometry,
      }));

      return { description, routes };
    } catch (error) {
      return {
        description,
        routes: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async simulateShipments(
    shipments: ShipmentDto[],
  ): Promise<ShipmentResultDto[]> {
    return Promise.all(shipments.map((s) => this.simulateShipment(s)));
  }
}
