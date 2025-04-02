// src/simulation.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ShipmentDto } from './dtos/shipment.dto';
import { ShipmentResultDto } from './dtos/shipment-result.dto';
import { RouteEntryDto } from './dtos/route-entry.dto';

@Injectable()
export class SimulationService {
  // Используем OSRM публичный сервер
  private readonly OSRM_API_URL = 'http://router.project-osrm.org/route/v1/driving';

  async simulateShipment(shipment: ShipmentDto): Promise<ShipmentResultDto> {
    const { originLat, originLon, destLat, destLon, description } = shipment;
    // OSRM ожидает координаты в формате: долгота,широта
    // Используем overview=full, альтернативы до 3 и возвращаем геометрию в формате GeoJSON
    const url = `${this.OSRM_API_URL}/${originLon},${originLat};${destLon},${destLat}?overview=full&alternatives=3&geometries=geojson`;

    try {
      const response = await axios.get(url);
      const osrmData = response.data;
      if (osrmData.code !== 'Ok' || !osrmData.routes || osrmData.routes.length === 0) {
        return { description, routes: null, error: 'Маршрут не найден' };
      }

      // Преобразуем реальные маршруты: расстояние в км, время в минутах и сохраняем геометрию
      const routes: RouteEntryDto[] = osrmData.routes.map((route: any) => ({
        distanceKM: route.distance / 1000,
        durationMin: route.duration / 60,
        geometry: route.geometry,
      }));

      // Если маршрутов меньше 10, можно сымитировать дополнительные варианты (на основе первого маршрута)
      const desiredRoutes = 10;
      if (routes.length > 0 && routes.length < desiredRoutes) {
        const base = routes[0];
        while (routes.length < desiredRoutes) {
          // Добавляем случайное отклонение ±5%
          const noiseFactor = 1 + (Math.random() * 0.1 - 0.05);
          const simulatedRoute: RouteEntryDto = {
            distanceKM: parseFloat((base.distanceKM * noiseFactor).toFixed(2)),
            durationMin: parseFloat((base.durationMin * noiseFactor).toFixed(2)),
            geometry: base.geometry, // Используем ту же геометрию для примера
          };
          routes.push(simulatedRoute);
        }
      }

      return { description, routes };
    } catch (error) {
      return {
        description,
        routes: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async simulateShipments(shipments: ShipmentDto[]): Promise<ShipmentResultDto[]> {
    return Promise.all(shipments.map(shipment => this.simulateShipment(shipment)));
  }
}

