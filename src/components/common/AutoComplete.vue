<template>
  <div class="relative">
    <div class="relative">
      <input
        ref="inputRef"
        v-model="searchQuery"
        :placeholder="placeholder"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
        class="form-input"
        type="text"
      />
      <i
        v-if="searchQuery"
        @click="clearSelection"
        class="fa fa-times absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-lg md:text-xl"
        style="color: var(--color-text-light)"
      />
    </div>

    <!-- Dropdown with filtered results -->
    <div
      v-if="showDropdown && filteredItems.length > 0"
      class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-48 md:max-h-60 overflow-y-auto"
      style="border: 1px solid var(--color-light-gray)"
    >
      <div
        v-for="(item, index) in filteredItems"
        :key="getItemKey(item)"
        @click="selectItem(item)"
        @mouseenter="highlightedIndex = index"
        class="px-3 py-2 md:px-4 md:py-3 cursor-pointer transition-colors duration-150 border-b last:border-b-0 text-sm md:text-base"
        :style="{
          borderColor: 'var(--color-border-light)',
          backgroundColor: highlightedIndex === index ? 'var(--color-bg-hover)' : 'transparent',
          color: highlightedIndex === index ? 'var(--color-text)' : 'inherit',
        }"
      >
        {{ getItemDisplayText(item) }}
      </div>
    </div>

    <!-- User feedback when no results are found -->
    <div
      v-if="showDropdown && searchQuery && filteredItems.length === 0"
      class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg p-3 md:p-4"
      style="border: 1px solid var(--color-light-gray)"
    >
      <p class="text-center text-sm md:text-base" style="color: var(--color-text-muted)">
        No results found
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  items: Array<{ id: string; name: string }>
  searchKey: string
  placeholder?: string
  getItemKey?: (item: { id: string; name: string }) => string
  getItemDisplayText?: (item: { id: string; name: string }) => string
}

interface Emits {
  select: [item: { id: string; name: string } | null]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  getItemKey: (item: { id: string; name: string }) => item.id || item.name,
  getItemDisplayText: (item: { id: string; name: string }) => item.name || 'Unknown',
})

const emit = defineEmits<Emits>()

const searchQuery = ref('')
const showDropdown = ref(false)
const highlightedIndex = ref(-1)
const inputRef = ref<HTMLInputElement | null>(null)

// Filters items based on user input
const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items
  const query = searchQuery.value.toLowerCase()
  return props.items.filter((item) =>
    String(item[props.searchKey as keyof typeof item] || '')
      .toLowerCase()
      .includes(query),
  )
})

// Clear search
const clearSelection = () => {
  searchQuery.value = ''
  emit('select', null)
  showDropdown.value = false
  highlightedIndex.value = -1
}

// Item selection from dropdown
const selectItem = (item: { id: string; name: string }) => {
  searchQuery.value = props.getItemDisplayText(item)
  showDropdown.value = false
  emit('select', item)
}

const closeDropdown = () => {
  showDropdown.value = false
  highlightedIndex.value = -1
}

const onInput = () => {
  showDropdown.value = true
  highlightedIndex.value = -1
}

const onFocus = () => {
  if (props.items.length > 0) showDropdown.value = true
}

const onBlur = () => {
  setTimeout(closeDropdown, 150)
}

// Keyboard navigation and selection
const onKeydown = (event: KeyboardEvent) => {
  if (!showDropdown.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, filteredItems.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0) {
        selectItem(filteredItems.value[highlightedIndex.value])
      } else if (searchQuery.value.trim()) {
        const items = filteredItems.value
        if (items.length > 0) {
          selectItem(items[0])
        } else {
          emit('select', { id: 'search', name: searchQuery.value.trim() })
          closeDropdown()
        }
      }
      break
    case 'Escape':
      closeDropdown()
      break
  }
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (inputRef.value && !inputRef.value.contains(target)) {
    closeDropdown()
  }
}

watch(
  () => props.items,
  (newItems) => {
    if (newItems.length === 0) showDropdown.value = false
  },
)

watch(
  () => searchQuery.value,
  (newQuery) => {
    if (!newQuery.trim()) {
      emit('select', null)
      highlightedIndex.value = -1
      if (props.items.length > 0) showDropdown.value = true
    }
  },
)

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
