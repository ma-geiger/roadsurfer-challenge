import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useRentalService } from '../services/rentalService'

global.fetch = vi.fn()

describe('useRentalService', () => {
  let rentalService: ReturnType<typeof useRentalService>

  beforeEach(() => {
    rentalService = useRentalService()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  const createMockStation = (id: string, name: string, bookings: any[] = []) => ({
    id,
    name,
    bookings,
  })

  const createMockBooking = (
    id: string,
    customerName: string,
    startDate: string,
    endDate?: string,
    returnStation?: string,
  ) => ({
    id,
    customerName,
    startDate,
    endDate,
    returnStation,
  })

  const createMockResponse = (ok: boolean, data?: any, status?: number) => ({
    ok,
    status,
    json: async () => data,
  })

  describe('fetchStations', () => {
    const mockStations = [
      createMockStation('1', 'Station A', [
        createMockBooking('1', 'John Doe', '2024-01-01', '2024-01-03'),
      ]),
      createMockStation('2', 'Station B', [
        createMockBooking('2', 'Jane Smith', '2024-01-02', '2024-01-04'),
      ]),
    ]

    it('should fetch stations successfully', async () => {
      ;(fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse(true, mockStations),
      )

      const result = await rentalService.fetchStations()

      expect(fetch).toHaveBeenCalledWith('https://605c94c36d85de00170da8b4.mockapi.io/stations')
      expect(result).toEqual(mockStations)
    })

    it.each([
      [500, 'Failed to fetch stations'],
      [404, 'Failed to fetch stations'],
      [403, 'Failed to fetch stations'],
    ])('should throw error when API call fails with status %i', async (status, expectedError) => {
      ;(fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse(false, undefined, status),
      )

      await expect(rentalService.fetchStations()).rejects.toThrow(expectedError)
    })

    it('should throw error when network fails', async () => {
      ;(fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'))

      await expect(rentalService.fetchStations()).rejects.toThrow('Network error')
    })
  })

  describe('fetchStationById', () => {
    it.each([
      ['1', 'Station A', 'John Doe', '2024-01-01', '2024-01-03'],
      ['2', 'Station B', 'Jane Smith', '2024-01-02', '2024-01-04'],
      ['3', 'Station C', 'Bob Wilson', '2024-01-03', undefined],
    ])(
      'should fetch station %s successfully',
      async (id, name, customerName, startDate, endDate) => {
        const mockStation = createMockStation(id, name, [
          createMockBooking(id, customerName, startDate, endDate),
        ])

        ;(fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
          createMockResponse(true, mockStation),
        )

        const result = await rentalService.fetchStationById(id)

        expect(fetch).toHaveBeenCalledWith(
          `https://605c94c36d85de00170da8b4.mockapi.io/stations/${id}`,
        )
        expect(result).toEqual(mockStation)
      },
    )

    it.each([
      ['999', 404],
      ['invalid', 400],
      ['0', 500],
    ])('should throw error when station %s not found (status %i)', async (id, status) => {
      ;(fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse(false, undefined, status),
      )

      await expect(rentalService.fetchStationById(id)).rejects.toThrow('Failed to fetch station')
    })
  })

  describe('fetchBookingById', () => {
    it.each([
      ['1', '1', 'John Doe', '2024-01-01', '2024-01-03', 'Station A'],
      ['2', '3', 'Jane Smith', '2024-01-02', '2024-01-05', 'Station B'],
      ['3', '5', 'Bob Wilson', '2024-01-03', undefined, undefined],
    ])(
      'should fetch booking %s from station %s successfully',
      async (stationId, bookingId, customerName, startDate, endDate, returnStation) => {
        const mockBooking = createMockBooking(
          bookingId,
          customerName,
          startDate,
          endDate,
          returnStation,
        )

        ;(fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
          createMockResponse(true, mockBooking),
        )

        const result = await rentalService.fetchBookingById(stationId, bookingId)

        expect(fetch).toHaveBeenCalledWith(
          `https://605c94c36d85de00170da8b4.mockapi.io/stations/${stationId}/bookings/${bookingId}`,
        )
        expect(result).toEqual(mockBooking)
      },
    )

    it.each([
      ['1', '999', 404],
      ['invalid', '1', 400],
      ['0', '0', 500],
    ])(
      'should throw error when booking %s from station %s not found (status %i)',
      async (stationId, bookingId, status) => {
        ;(fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
          createMockResponse(false, undefined, status),
        )

        await expect(rentalService.fetchBookingById(stationId, bookingId)).rejects.toThrow(
          'Failed to fetch booking',
        )
      },
    )
  })

  describe('getStationSummaries', () => {
    it.each([
      [
        [
          createMockStation('1', 'Station A'),
          createMockStation('2', 'station-name{{i}}'),
          createMockStation('3', 'Station C'),
        ],
        [
          { id: '1', name: 'Station A' },
          { id: '3', name: 'Station C' },
        ],
        2,
        'filter and map station summaries correctly',
      ],
      [
        [createMockStation('1', 'station-name{{i}}'), createMockStation('2', 'station-name{{i}}')],
        [],
        0,
        'return empty array for invalid stations',
      ],
      [[], [], 0, 'handle empty stations array'],
    ])('should %s', (inputStations, expectedResult, expectedLength, description) => {
      const result = rentalService.getStationSummaries(inputStations)

      expect(result).toEqual(expectedResult)
      expect(result).toHaveLength(expectedLength)
    })
  })
})
