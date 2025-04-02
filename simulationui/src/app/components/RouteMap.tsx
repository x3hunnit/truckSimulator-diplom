import dynamic from 'next/dynamic'
import type { FC } from 'react'
import { LatLngExpression } from 'leaflet'
import { Shipment } from './RouteForm'

// Динамический импорт компонентов react-leaflet с явной типизацией
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer) as Promise<React.FC<any>>,
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer) as Promise<React.FC<any>>,
  { ssr: false }
)
const Polyline = dynamic(
  () => import('react-leaflet').then(mod => mod.Polyline) as Promise<React.FC<any>>,
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker) as Promise<React.FC<any>>,
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup) as Promise<React.FC<any>>,
  { ssr: false }
)

interface RouteMapProps {
  center: [number, number] // [lat, lon]
  // Геометрия одного маршрута: массив координат [ [lon, lat], ... ]
  routeGeometry: number[][] 
  shipment: Shipment | null
}

const RouteMap: FC<RouteMapProps> = ({ center, routeGeometry, shipment }) => {
  const mapCenter: LatLngExpression = center

  // Преобразуем координаты маршрута: из [lon, lat] в [lat, lon] для Polyline
  const polylinePositions: [number, number][] = routeGeometry.map(
    (coord) => [coord[1], coord[0]] as [number, number]
  )

  return (
    <MapContainer center={mapCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={polylinePositions} color="blue" opacity={0.8} weight={4} />
      {shipment && (
        <>
          <Marker position={[shipment.originLat, shipment.originLon]}>
            <Popup>Origin</Popup>
          </Marker>
          <Marker position={[shipment.destLat, shipment.destLon]}>
            <Popup>Destination</Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  )
}

export default RouteMap

