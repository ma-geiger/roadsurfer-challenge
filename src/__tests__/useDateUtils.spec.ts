import { describe, it, expect, beforeEach } from 'vitest'
import { useDateUtils } from '../composables/useDateUtils'
import type { Station } from '../services/rentalService'

describe('useDateUtils', () => {
  let dateUtils: ReturnType<typeof useDateUtils>

  beforeEach(() => {
    dateUtils = useDateUtils()
  })

  describe('formatDate', () => {
    it.each([
      ['2024-01-15T10:30:00Z', '2024-01-15'],
      ['2024-12-31T23:59:59Z', '2024-12-31'],
      ['2024-06-01T00:00:00Z', '2024-06-01'],
      ['2024-02-29T12:00:00Z', '2024-02-29'],
    ])('should format %s to %s', (input, expected) => {
      const date = new Date(input)
      const result = dateUtils.formatDate(date)
      expect(result).toBe(expected)
    })
  })

  describe('buildWeekDays', () => {
    const createMockStation = (id: string, name: string, bookings: any[]): Station => ({
      id,
      name,
      bookings,
    })

    const createMockBooking = (
      id: string,
      customerName: string,
      startDate: string,
      endDate?: string,
    ) => ({
      id,
      customerName,
      startDate,
      endDate,
    })

    it('should build week days correctly with single booking', () => {
      const startDate = new Date('2024-01-15')
      const mockStations: Station[] = [
        createMockStation('1', 'Station A', [
          createMockBooking('1', 'John Doe', '2024-01-15', '2024-01-17'),
        ]),
      ]

      const result = dateUtils.buildWeekDays(startDate, mockStations)

      expect(result).toHaveLength(7)
      expect(result[0].date).toBe('2024-01-15')
      expect(result[0].weekday).toBe('Mon')
      expect(result[0].bookings).toHaveLength(1)
      expect(result[0].bookings[0].type).toBe('start')
      expect(result[0].bookings[0].booking.customerName).toBe('John Doe')
      expect(result[2].date).toBe('2024-01-17')
      expect(result[2].bookings).toHaveLength(1)
      expect(result[2].bookings[0].type).toBe('end')
    })

    it('should handle bookings without end dates', () => {
      const startDate = new Date('2024-01-15')
      const mockStations: Station[] = [
        createMockStation('1', 'Station A', [createMockBooking('1', 'John Doe', '2024-01-15')]),
      ]

      const result = dateUtils.buildWeekDays(startDate, mockStations)

      expect(result[0].bookings).toHaveLength(1)
      expect(result[0].bookings[0].type).toBe('start')
    })

    it('should handle multiple stations and bookings', () => {
      const startDate = new Date('2024-01-15')
      const mockStations: Station[] = [
        createMockStation('1', 'Station A', [
          createMockBooking('1', 'John Doe', '2024-01-15', '2024-01-16'),
        ]),
        createMockStation('2', 'Station B', [
          createMockBooking('2', 'Jane Smith', '2024-01-16', '2024-01-18'),
        ]),
      ]

      const result = dateUtils.buildWeekDays(startDate, mockStations)

      const expectedBookings = [
        { date: '2024-01-15', count: 1 },
        { date: '2024-01-16', count: 2 },
        { date: '2024-01-17', count: 0 },
        { date: '2024-01-18', count: 1 },
      ]

      expectedBookings.forEach(({ date, count }, index) => {
        expect(result[index].date).toBe(date)
        expect(result[index].bookings).toHaveLength(count)
      })
    })

    it.each([
      [[], 'empty stations array'],
      [[{ id: '1', name: 'Station A', bookings: [] }], 'stations with no bookings'],
    ])('should handle %s', (stations, description) => {
      const startDate = new Date('2024-01-15')
      const result = dateUtils.buildWeekDays(startDate, stations as Station[])

      expect(result).toHaveLength(7)
      expect(result[0].date).toBe('2024-01-15')
      expect(result[0].weekday).toBe('Mon')
      expect(result[0].bookings).toHaveLength(0)
    })
  })

  describe('getPreviousWeek', () => {
    it.each([
      ['2024-01-15', '2024-01-08'],
      ['2024-01-01', '2023-12-25'],
    ])('should return %s when current date is %s', (current, expected) => {
      const currentDate = new Date(current)
      const result = dateUtils.getPreviousWeek(currentDate)

      const expectedDate = new Date(expected)
      expect(result.getTime()).toBe(expectedDate.getTime())
    })
  })

  describe('getNextWeek', () => {
    it.each([
      ['2024-01-15', '2024-01-22'],
      ['2024-01-31', '2024-02-07'],
    ])('should return %s when current date is %s', (current, expected) => {
      const currentDate = new Date(current)
      const result = dateUtils.getNextWeek(currentDate)

      const expectedDate = new Date(expected)
      expect(result.getTime()).toBe(expectedDate.getTime())
    })
  })
})
