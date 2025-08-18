import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AutoComplete from '../../../components/common/AutoComplete.vue'

describe('AutoComplete', () => {
  const mockItems = [
    { id: '1', name: 'Station Alpha' },
    { id: '2', name: 'Station Beta' },
    { id: '3', name: 'Station Gamma' },
  ]

  const createWrapper = (props = {}) => {
    return mount(AutoComplete, {
      props: {
        items: mockItems,
        searchKey: 'name',
        placeholder: 'Search stations...',
        ...props,
      },
    })
  }

  it('renders properly', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('placeholder')).toBe('Search stations...')
  })

  it.each([
    ['Alpha', 'Alpha'],
    ['Beta', 'Beta'],
    ['Gamma', 'Gamma'],
  ])('filters items based on search input %s', async (searchTerm) => {
    const wrapper = createWrapper()

    const input = wrapper.find('input')
    await input.setValue(searchTerm)

    expect(wrapper.find('.fa-times').exists()).toBe(true)
  })

  it('emits select event when item is clicked', async () => {
    const wrapper = createWrapper()

    const input = wrapper.find('input')
    await input.setValue('Alpha')

    await wrapper.vm.$emit('select', mockItems[0])

    expect(wrapper.emitted('select')).toBeTruthy()
  })

  it.each([
    ['test', true],
    ['Alpha', true],
    ['', false],
  ])('shows clear icon when there is text %s', async (inputValue, shouldShowIcon) => {
    const wrapper = createWrapper()

    const input = wrapper.find('input')
    if (inputValue) {
      await input.setValue(inputValue)
    }

    expect(wrapper.find('.fa-times').exists()).toBe(shouldShowIcon)
  })

  it('clears selection when clear icon is clicked', async () => {
    const wrapper = createWrapper()

    const input = wrapper.find('input')
    await input.setValue('test')

    const clearIcon = wrapper.find('.fa-times')
    await clearIcon.trigger('click')

    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual([null])
  })
})
