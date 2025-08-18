import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WeekNavigation from '@/components/week/WeekNavigation.vue'

describe('WeekNavigation', () => {
  it.each([
    ['previous', 0, 'previous'],
    ['today', 1, 'today'],
    ['next', 2, 'next'],
  ])('emits %s event when %s button is clicked', async (eventName, buttonIndex, expectedEvent) => {
    const wrapper = mount(WeekNavigation)

    await wrapper.findAll('button')[buttonIndex].trigger('click')

    expect(wrapper.emitted(expectedEvent)).toBeTruthy()
  })

  it('renders all three navigation buttons', () => {
    const wrapper = mount(WeekNavigation)

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(3)
  })

  it('shows navigation text only on desktop', () => {
    const wrapper = mount(WeekNavigation)

    const spans = wrapper.findAll('span')
    expect(spans).toHaveLength(2)
    expect(spans[0].classes()).toContain('hidden')
    expect(spans[0].classes()).toContain('md:inline')
  })
})
