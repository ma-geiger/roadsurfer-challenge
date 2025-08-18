import type { Booking } from '../services/rentalService'
import { ref } from 'vue'

export const useDragAndDrop = () => {
  const draggedBooking = ref<Booking | null>(null)
  const draggedType = ref<'start' | 'end' | null>(null)

  const handleDragStart = (booking: Booking, type: 'start' | 'end') => {
    draggedBooking.value = booking
    draggedType.value = type
  }

  const handleDrop = (
    targetDateStr: string,
    onDateChange: (booking: Booking, type: 'start' | 'end', newDate: string) => void,
  ) => {
    if (!draggedBooking.value || !draggedType.value) return

    const booking = draggedBooking.value
    const type = draggedType.value
    const formattedDate = new Date(targetDateStr).toISOString().split('T')[0]

    onDateChange(booking, type, formattedDate)

    draggedBooking.value = null
    draggedType.value = null
  }

  const clearDragState = () => {
    draggedBooking.value = null
    draggedType.value = null
  }

  return {
    draggedBooking,
    draggedType,
    handleDragStart,
    handleDrop,
    clearDragState,
  }
}
