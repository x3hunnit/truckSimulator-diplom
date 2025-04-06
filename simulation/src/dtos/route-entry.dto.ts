// src/dtos/route-entry.dto.ts
export class RouteEntryDto {
  distanceKM: number;
  durationMin: number;
  // geometry содержит GeoJSON-объект, например LineString с координатами [ [lon, lat], ... ]
  geometry: {
    type: string;
    coordinates: number[][];
  };
}
