import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorState from '@/components/common/ErrorState.vue'

describe('ErrorState', () => {
  it('renders error message', () => {
    const errorMessage = 'Something went wrong'
    const wrapper = mount(ErrorState, {
      props: {
        message: errorMessage,
      },
    })

    expect(wrapper.find('.error-text').text()).toBe(errorMessage)
  })
})
