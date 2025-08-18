import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WeekGrid from '../../../components/week/WeekGrid.vue'
import type { DayData } from '../../../composables/useDateUtils'

describe('WeekGrid', () => {
  const mockWeekDays: DayData[] = [
    {
      date: '2024-01-01',
      weekday: 'Mon',
      isCurrentDay: false,
      bookings: [
        {
          station: 'station-1',
          booking: {
            id: 'booking-1',
            customerName: 'John Doe',
            startDate: '2024-01-01',
            endDate: '2024-01-03',
          },
          type: 'start' as const,
        },
      ],
    },
    {
      date: '2024-01-02',
      weekday: 'Tue',
      isCurrentDay: true,
      bookings: [],
    },
  ]

  const createWrapper = (props: { weekDays: DayData[]; isMobile: boolean }) => {
    return mount(WeekGrid, { props })
  }

  it('renders the correct number of day cards', () => {
    const wrapper = createWrapper({
      weekDays: mockWeekDays,
      isMobile: false,
    })

    const dayCards = wrapper.findAll('.day-card')
    expect(dayCards).toHaveLength(2)
  })

  it('shows current day indicator', () => {
    const wrapper = createWrapper({
      weekDays: mockWeekDays,
      isMobile: false,
    })

    const currentDayCard = wrapper.findAll('.day-card')[1]
    expect(currentDayCard.text()).toContain('- (Today)')
  })

  it('displays booking information correctly', () => {
    const wrapper = createWrapper({
      weekDays: mockWeekDays,
      isMobile: false,
    })

    const bookingItem = wrapper.find('.booking-item')
    expect(bookingItem.text()).toContain('John Doe')
    expect(bookingItem.text()).toContain('Pickup')
  })

  it('shows no bookings message when day has no bookings', () => {
    const wrapper = createWrapper({
      weekDays: mockWeekDays,
      isMobile: false,
    })

    const emptyDayCard = wrapper.findAll('.day-card')[1]
    expect(emptyDayCard.text()).toContain('No bookings')
  })

  it('emits drop event when item is dropped', async () => {
    const wrapper = createWrapper({
      weekDays: mockWeekDays,
      isMobile: false,
    })

    const dayCard = wrapper.find('.day-card')
    await dayCard.trigger('drop')

    expect(wrapper.emitted('drop')).toBeTruthy()
    expect(wrapper.emitted('drop')?.[0]).toEqual(['2024-01-01'])
  })

  it('emits dragStart event when booking is dragged', async () => {
    const wrapper = createWrapper({
      weekDays: mockWeekDays,
      isMobile: false,
    })

    const bookingItem = wrapper.find('.booking-item')
    await bookingItem.trigger('dragstart')

    expect(wrapper.emitted('dragStart')).toBeTruthy()
    expect(wrapper.emitted('dragStart')?.[0]).toEqual([
      mockWeekDays[0].bookings[0].booking,
      'start',
    ])
  })

  it('emits bookingClick event when booking is clicked on desktop', async () => {
    const wrapper = createWrapper({
      weekDays: mockWeekDays,
      isMobile: false,
    })

    const bookingItem = wrapper.find('.booking-item')
    await bookingItem.trigger('click')

    expect(wrapper.emitted('bookingClick')).toBeTruthy()
    expect(wrapper.emitted('bookingClick')?.[0]).toEqual(['station-1', 'booking-1'])
  })

  it('emits mobileClick event when mobile arrow is clicked', async () => {
    const wrapper = createWrapper({
      weekDays: mockWeekDays,
      isMobile: true,
    })

    await wrapper.vm.$nextTick()

    const mobileArrow = wrapper.find('.fa-arrow-right')
    expect(mobileArrow.exists()).toBe(true)

    await mobileArrow.trigger('click')

    expect(wrapper.emitted('mobileClick')).toBeTruthy()
    expect(wrapper.emitted('mobileClick')?.[0]).toEqual(['station-1', 'booking-1'])
  })
})
