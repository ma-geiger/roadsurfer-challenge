import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WeeklyView from '@/components/week/WeeklyView.vue'

vi.mock('@/stores/weeklyViewStore', () => ({
  useWeeklyViewStore: () => ({
    currentWeekStart: { value: new Date('2024-01-01') },
    setCurrentWeek: vi.fn(),
    resetToDefaults: vi.fn(),
    loadFromStorage: vi.fn(),
  }),
}))

vi.mock('@/composables/useDragAndDrop', () => ({
  useDragAndDrop: () => ({
    handleDragStart: vi.fn(),
    handleDrop: vi.fn(),
  }),
}))

vi.mock('@/composables/useDateUtils', () => ({
  useDateUtils: () => ({
    buildWeekDays: vi.fn(() => []),
    getPreviousWeek: vi.fn(),
    getNextWeek: vi.fn(),
  }),
}))

vi.mock('@/services/rentalService', () => ({
  useRentalService: () => ({
    fetchStations: vi.fn(() => Promise.resolve([])),
    fetchStationById: vi.fn(),
    getStationSummaries: vi.fn(() => []),
  }),
}))

describe('WeeklyView', () => {
  it('renders without errors', () => {
    const wrapper = mount(WeeklyView)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders WeekNavigation component', () => {
    const wrapper = mount(WeeklyView)
    expect(wrapper.findComponent({ name: 'WeekNavigation' })).toBeTruthy()
  })

  it('renders WeekGrid component when not loading', () => {
    const wrapper = mount(WeeklyView)
    expect(wrapper.findComponent({ name: 'WeekGrid' })).toBeTruthy()
  })
})
