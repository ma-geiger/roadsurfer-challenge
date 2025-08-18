import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingState from '@/components/common/LoadingState.vue'

describe('LoadingState', () => {
  it('renders loading spinner and message', () => {
    const wrapper = mount(LoadingState)

    expect(wrapper.find('.loading-spinner').exists()).toBe(true)
    expect(wrapper.text()).toContain('Loading...')
  })
})
