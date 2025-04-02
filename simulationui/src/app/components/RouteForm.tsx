
// src/app/components/RouteForm.tsx
import { useState, ChangeEvent, FormEvent } from 'react'

export interface Shipment {
  originLat: number
  originLon: number
  destLat: number
  destLon: number
  description: string
}

interface RouteFormProps {
  onSubmit: (data: Shipment) => void
}

const RouteForm = ({ onSubmit }: RouteFormProps) => {
  const [formData, setFormData] = useState({
    originLat: '',
    originLon: '',
    destLat: '',
    destLon: '',
    description: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data: Shipment = {
      originLat: parseFloat(formData.originLat),
      originLon: parseFloat(formData.originLon),
      destLat: parseFloat(formData.destLat),
      destLon: parseFloat(formData.destLon),
      description: formData.description,
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
      <div>
        <label className="block font-medium mb-1">Origin Latitude</label>
        <input
          type="text"
          name="originLat"
          value={formData.originLat}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="e.g. 55.7558"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Origin Longitude</label>
        <input
          type="text"
          name="originLon"
          value={formData.originLon}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="e.g. 37.6173"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Destination Latitude</label>
        <input
          type="text"
          name="destLat"
          value={formData.destLat}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="e.g. 59.9311"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Destination Longitude</label>
        <input
          type="text"
          name="destLon"
          value={formData.destLon}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="e.g. 30.3609"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Route description"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Simulate Route
      </button>
    </form>
  )
}

export default RouteForm
