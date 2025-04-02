// src/dtos/route-entry.dto.ts
export class RouteEntryDto {
  distanceKM: number;
  durationMin: number;
  // geometry будет содержать GeoJSON-объект маршрута
  geometry?: {
    type: string;
    coordinates: number[][]; // Массив координат вида [lon, lat]
  };
}

