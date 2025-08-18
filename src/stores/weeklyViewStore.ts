import { ref, computed } from 'vue'

const STORAGE_KEY = 'weeklyViewState'

interface StoredState {
  currentWeekStart: string
}

const getStoredState = (): StoredState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const useWeeklyViewStore = () => {
  const currentWeekStart = ref(new Date())

  const loadFromStorage = () => {
    const stored = getStoredState()
    if (stored) {
      currentWeekStart.value = new Date(stored.currentWeekStart)
    }
  }

  const saveToStorage = () => {
    const state: StoredState = {
      currentWeekStart: currentWeekStart.value.toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  const setCurrentWeek = (date: Date) => {
    currentWeekStart.value = date
    saveToStorage()
  }

  const resetToDefaults = () => {
    currentWeekStart.value = new Date()
    saveToStorage()
  }

  return {
    currentWeekStart: computed(() => currentWeekStart.value),
    loadFromStorage,
    setCurrentWeek,
    resetToDefaults,
  }
}
