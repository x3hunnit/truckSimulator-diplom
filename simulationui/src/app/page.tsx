// src/app/page.tsx
'use client'
import { useState } from 'react'
import RouteForm, { Shipment } from './components/RouteForm'
import RouteMap from './components/RouteMap'

export default function Home() {
  const [shipment, setShipment] = useState<Shipment | null>(null)
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
      const result = await response.json()
      if (result && result.length > 0) {
        const shipmentResult = result[0]
        if (shipmentResult.error) {
          setError(shipmentResult.error)
        } else if (shipmentResult.routes && shipmentResult.routes.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const geometries: number[][][] = shipmentResult.routes.map((route: any) => {
            if (route.geometry && route.geometry.coordinates) {
              return route.geometry.coordinates
            } else {
              return [
                [data.originLon, data.originLat],
                [data.destLon, data.destLat],
              ]
            }
          })

          console.log("Original geometries:", geometries)

          const desiredRoutes = 3
          if (geometries.length < desiredRoutes && geometries.length > 0) {
            const base = geometries[0]
            while (geometries.length < desiredRoutes) {
              const simulatedRoute = base.map(coord => {
                const noiseFactorLon = 1 + (Math.random() * 0.02 - 0.01)
                const noiseFactorLat = 1 + (Math.random() * 0.02 - 0.01)
                return [coord[0] * noiseFactorLon, coord[1] * noiseFactorLat]
              })
              geometries.push(simulatedRoute)
            }
          }
          console.log("Final geometries:", geometries)
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Route Simulation</h1>
      <RouteForm onSubmit={handleSubmit} />
      {error && <p className="text-red-500 my-4">{error}</p>}
      {routeGeometries && routeGeometries.length > 0 ? (
        routeGeometries.map((geometry, index) => {
          const center: [number, number] =
            geometry && geometry.length > 0
              ? ([geometry[0][1], geometry[0][0]] as [number, number])
              : ([55.7558, 37.6173] as [number, number])
          return (
            <div key={index} className="h-96 mt-6 border mb-4">
              <h2 className="text-xl mb-2">Route {index + 1}</h2>
              <RouteMap center={center} routeGeometry={geometry} shipment={shipment} />
            </div>
          )
        })
      ) : (
        <div className="h-96 mt-6">
          <p className="text-center text-gray-500">No route available</p>
        </div>
      )}
    </div>
  )
}

