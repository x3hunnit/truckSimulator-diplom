// src/app/layout.tsx
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Route Simulation',
  description: 'Simulate and visualize routes using OSRM and Leaflet',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}

