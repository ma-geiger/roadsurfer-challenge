import { config } from '@/config/env'

const API_BASE_URL = config.api.baseUrl

export interface Station {
  id: string
  name: string
  bookings: Booking[]
}

export interface Booking {
  id: string
  customerName: string
  startDate: string
  endDate?: string
  returnStation?: string
}

export interface StationSummary {
  id: string
  name: string
}

export const useRentalService = () => {
  const fetchStations = async (): Promise<Station[]> => {
    const response = await fetch(`${API_BASE_URL}/stations`)
    if (!response.ok) {
      throw new Error('Failed to fetch stations')
    }
    return response.json()
  }

  const fetchStationById = async (id: string): Promise<Station> => {
    const response = await fetch(`${API_BASE_URL}/stations/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch station')
    }
    return response.json()
  }

  const fetchBookingById = async (stationId: string, bookingId: string): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/stations/${stationId}/bookings/${bookingId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch booking')
    }
    return response.json()
  }

  const getStationSummaries = (stations: Station[]): StationSummary[] => {
    return stations
      .map((station) => ({
        id: station.id,
        name: station.name !== 'station-name{{i}}' ? station.name : null,
      }))
      .filter((station): station is StationSummary => station.name !== null)
  }

  return {
    fetchStations,
    fetchStationById,
    fetchBookingById,
    getStationSummaries,
  }
}
