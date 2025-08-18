import type { Station, Booking } from '../services/rentalService'

export interface DayData {
  date: string
  weekday: string
  bookings: BookingEntry[]
  isCurrentDay: boolean
}

export interface BookingEntry {
  station: string
  booking: Booking
  type: 'start' | 'end'
}

export const useDateUtils = () => {
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  const buildWeekDays = (startDate: Date, stations: Station[]): DayData[] => {
    const week: DayData[] = []
    const dayMap: Record<string, BookingEntry[]> = {}

    stations.forEach((station) => {
      station.bookings.forEach((booking) => {
        // Always create pickup entry (start of rental)
        const startStr = formatDate(new Date(booking.startDate))
        if (!dayMap[startStr]) dayMap[startStr] = []
        dayMap[startStr].push({ station: station.id, booking, type: 'start' })

        // Create return entry only if different from pickup date
        const endStr = formatDate(
          booking.endDate ? new Date(booking.endDate) : new Date(booking.startDate),
        )
        if (endStr !== startStr) {
          if (!dayMap[endStr]) dayMap[endStr] = []
          dayMap[endStr].push({ station: station.id, booking, type: 'end' })
        }
      })
    })

    // Calculate the Monday of the week - getDay() returns 0=Sunday, 1=Monday, 2=Tuesday, etc.
    const current = new Date(startDate)
    const dayOfWeek = current.getDay()
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

    current.setDate(current.getDate() - daysToMonday)

    // Build week from Monday to Sunday (7 days)
    for (let i = 0; i < 7; i++) {
      const dayStr = formatDate(current)
      const weekday = current.toLocaleDateString('en-US', { weekday: 'short' })

      week.push({
        date: dayStr,
        weekday,
        bookings: dayMap[dayStr] || [],
        isCurrentDay: current.toISOString().split('T')[0] === formatDate(new Date()),
      })

      current.setDate(current.getDate() + 1)
    }

    return week
  }

  const getPreviousWeek = (currentWeekStart: Date): Date => {
    const prev = new Date(currentWeekStart)
    prev.setDate(prev.getDate() - 7)
    return prev
  }

  const getNextWeek = (currentWeekStart: Date): Date => {
    const next = new Date(currentWeekStart)
    next.setDate(next.getDate() + 7)
    return next
  }

  return {
    formatDate,
    buildWeekDays,
    getPreviousWeek,
    getNextWeek,
  }
}
