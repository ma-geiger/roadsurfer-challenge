import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useDragAndDrop } from '../composables/useDragAndDrop'
import type { Booking } from '../services/rentalService'

describe('useDragAndDrop', () => {
  let dragAndDrop: ReturnType<typeof useDragAndDrop>
  let mockOnDateChange: ReturnType<typeof vi.fn>

  beforeEach(() => {
    dragAndDrop = useDragAndDrop()
    mockOnDateChange = vi.fn()
  })

  const createMockBooking = (
    id: string,
    customerName: string,
    startDate: string,
    endDate: string,
  ): Booking => ({
    id,
    customerName,
    startDate,
    endDate,
  })

  const defaultMockBooking = createMockBooking('1', 'John Doe', '2024-01-15', '2024-01-17')

  describe('handleDragStart', () => {
    it.each([
      ['start', 'start'],
      ['end', 'end'],
    ])('should set dragged booking and type for %s', (type, expectedType) => {
      dragAndDrop.handleDragStart(defaultMockBooking, type as 'start' | 'end')

      expect(dragAndDrop.draggedBooking.value).toEqual(defaultMockBooking)
      expect(dragAndDrop.draggedType.value).toBe(expectedType)
    })
  })

  describe('handleDrop', () => {
    it.each([
      ['start', '2024-01-20', '2024-01-20'],
      ['end', '2024-01-25', '2024-01-25'],
      ['start', '2024-01-01', '2024-01-01'],
    ])(
      'should call onDateChange with correct parameters for %s type',
      (type, dropDate, expectedDate) => {
        dragAndDrop.handleDragStart(defaultMockBooking, type as 'start' | 'end')
        dragAndDrop.handleDrop(dropDate, mockOnDateChange)

        expect(mockOnDateChange).toHaveBeenCalledWith(defaultMockBooking, type, expectedDate)
      },
    )

    it.each([
      ['2024-01-20T15:30:00Z', '2024-01-20'],
      ['2024-01-20T15:30:00.000Z', '2024-01-20'],
      ['2024-01-20T00:00:00Z', '2024-01-20'],
    ])('should format ISO date %s to %s', (isoDate, expectedDate) => {
      dragAndDrop.handleDragStart(defaultMockBooking, 'start')
      dragAndDrop.handleDrop(isoDate, mockOnDateChange)

      expect(mockOnDateChange).toHaveBeenCalledWith(defaultMockBooking, 'start', expectedDate)
    })

    it('should clear drag state after successful drop', () => {
      dragAndDrop.handleDragStart(defaultMockBooking, 'start')
      dragAndDrop.handleDrop('2024-01-20', mockOnDateChange)

      expect(dragAndDrop.draggedBooking.value).toBeNull()
      expect(dragAndDrop.draggedType.value).toBeNull()
    })

    it('should not call onDateChange when no drag state exists', () => {
      dragAndDrop.handleDrop('2024-01-20', mockOnDateChange)

      expect(mockOnDateChange).not.toHaveBeenCalled()
    })
  })

  describe('clearDragState', () => {
    it.each([
      ['with existing drag state', () => dragAndDrop.handleDragStart(defaultMockBooking, 'start')],
      ['without existing drag state', () => {}],
    ])('should clear both dragged booking and type %s', (description, setup) => {
      setup()

      dragAndDrop.clearDragState()

      expect(dragAndDrop.draggedBooking.value).toBeNull()
      expect(dragAndDrop.draggedType.value).toBeNull()
    })
  })

  describe('reactive state', () => {
    it('should initialize with null values', () => {
      expect(dragAndDrop.draggedBooking.value).toBeNull()
      expect(dragAndDrop.draggedType.value).toBeNull()
    })

    it('should maintain state between operations', () => {
      dragAndDrop.handleDragStart(defaultMockBooking, 'start')

      expect(dragAndDrop.draggedBooking.value).toEqual(defaultMockBooking)
      expect(dragAndDrop.draggedType.value).toBe('start')

      expect(dragAndDrop.draggedBooking.value).toEqual(defaultMockBooking)
      expect(dragAndDrop.draggedType.value).toBe('start')
    })
  })
})
