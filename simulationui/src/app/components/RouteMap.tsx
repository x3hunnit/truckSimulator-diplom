import dynamic from 'next/dynamic'
import type { FC } from 'react'
import { LatLngExpression } from 'leaflet'
import { Shipment } from './RouteForm'

// Динамический импорт компонентов react-leaflet с типизацией
const DynamicMapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const DynamicTileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const DynamicPolyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
)
const DynamicMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const DynamicPopup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface RouteMapProps {
  center: [number, number] // [lat, lon]
  // Массив маршрутов: каждый маршрут – массив координат вида [ [lon, lat], ... ]
  routeGeometries: number[][][] | null
  shipment: Shipment | null
}

// Функция для генерации случайного цвета в формате HEX
const randomColor = (): string => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const RouteMap: FC<RouteMapProps> = ({ center, routeGeometries, shipment }) => {
  const mapCenter: LatLngExpression = center

  return (
    <DynamicMapContainer center={mapCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
      <DynamicTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {routeGeometries &&
        routeGeometries.map((route, idx) => {
          // Преобразуем координаты маршрута из [lon, lat] в [lat, lon]
          const polylinePositions: [number, number][] = route.map(
            (coord) => [coord[1], coord[0]] as [number, number]
          )
          return (
            <DynamicPolyline
              key={idx}
              positions={polylinePositions}
              color={randomColor()}
              opacity={0.8}
              weight={4}
            />
          )
        })}
      {shipment && (
        <>
          <DynamicMarker position={[shipment.originLat, shipment.originLon]}>
            <DynamicPopup>Origin</DynamicPopup>
          </DynamicMarker>
          <DynamicMarker position={[shipment.destLat, shipment.destLon]}>
            <DynamicPopup>Destination</DynamicPopup>
          </DynamicMarker>
        </>
      )}
    </DynamicMapContainer>
  )
}

export default RouteMap

