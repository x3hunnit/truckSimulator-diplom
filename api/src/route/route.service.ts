import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class RouteService {
  constructor(private readonly httpService: HttpService) {}

  async getRoute(origin: string, destination: string): Promise<any> {
    try {
      const apiKey = process.env.YANDEX_API_KEY;
      if (!apiKey) {
        throw new Error('YANDEX_API_KEY не установлен');
      }
      const baseUrl = 'https://api.routing.yandex.net/v2/route';
      // Форматируем waypoints как "lat,lon|lat,lon"
      const waypoints = `${origin}|${destination}`;
      const url = `${baseUrl}?apikey=${apiKey}&waypoints=${encodeURIComponent(waypoints)}`;

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(url),
      );
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении маршрута:', error.message);
      throw new InternalServerErrorException(
        'Не удалось получить данные маршрута',
      );
    }
  }
}
