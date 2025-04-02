'use client'
import { useState } from 'react'
import RouteForm, { Shipment } from './components/RouteForm'
import RouteMap from './components/RouteMap'

// Определяем тип для маршрута, возвращаемого сервером
interface RouteGeometry {
  distanceKM: number
  durationMin: number
  geometry?: {
    type: string
    coordinates: number[][] // массив координат вида [ [lon, lat], ... ]
  }
}

interface ShipmentResult {
  description: string
  routes: RouteGeometry[] | null
  error?: string
}

export default function Home() {
  const [shipment, setShipment] = useState<Shipment | null>(null)
  // Массив маршрутов: каждый маршрут – массив координат вида [ [lon, lat], ... ]
  const [routeGeometries, setRouteGeometries] = useState<number[][][] | null>(null)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (data: Shipment) => {
    setError('')
    setRouteGeometries(null)
    setShipment(data)

    try {
      const response = await fetch('http://localhost:8080/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([data]),
      })
      // Явно указываем тип результата, чтобы избежать неявного any
      const result = (await response.json()) as ShipmentResult[]
      if (result && result.length > 0) {
        const shipmentResult = result[0]
        if (shipmentResult.error) {
          setError(shipmentResult.error)
        } else if (shipmentResult.routes && shipmentResult.routes.length > 0) {
          // Извлекаем геометрию маршрутов из ответа сервера
          const geometries: number[][][] = shipmentResult.routes.map((route) => {
            if (route.geometry && route.geometry.coordinates) {
              return route.geometry.coordinates // GeoJSON-формат: массив [ [lon, lat], ... ]
            } else {
              return [
                [data.originLon, data.originLat],
                [data.destLon, data.destLat],
              ]
            }
          })
          setRouteGeometries(geometries)
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Request error: ' + err.message)
      } else {
        setError('Request error')
      }
    }
  }

  // Вычисляем центр карты: берем первую точку первого маршрута, если он есть, иначе используем координаты Москвы
  const center: [number, number] =
    routeGeometries && routeGeometries.length > 0 && routeGeometries[0].length > 0
      ? ([routeGeometries[0][0][1], routeGeometries[0][0][0]] as [number, number])
      : ([55.7558, 37.6173] as [number, number])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Route Simulation</h1>
      <RouteForm onSubmit={handleSubmit} />
      {error && <p className="text-red-500 my-4">{error}</p>}
      <div className="h-96 mt-6">
        {/* Отображаем одну карту с 10 маршрутами */}
        <RouteMap center={center} routeGeometries={routeGeometries} shipment={shipment} />
      </div>
    </div>
  )
}

