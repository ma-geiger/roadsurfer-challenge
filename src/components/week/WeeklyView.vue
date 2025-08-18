<template>
  <div class="container-padding max-w-7xl mx-auto">
    <div class="section-margin">
      <AutoComplete
        id="station-select"
        :items="allStations"
        :search-key="'name'"
        placeholder="Search for a station..."
        @select="onStationSelect"
        class="w-full max-w-md mb-4 md:mb-6"
      />

      <WeekNavigation @previous="showPreviousWeek" @today="goToToday" @next="showNextWeek" />
    </div>

    <WeekGrid
      v-if="!loading && !error"
      :week-days="weekDays"
      :is-mobile="isMobile"
      @drop="handleDrop"
      @drag-start="handleDragStart"
      @booking-click="handleMobileClick"
      @mobile-click="navigateToBooking"
    />

    <LoadingState v-if="loading" />
    <ErrorState v-if="error" :message="error" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { AutoComplete, LoadingState, ErrorState } from '@/components/common'
import { WeekNavigation, WeekGrid } from '@/components/week'
import { useRentalService, type Station, type Booking } from '@/services/rentalService'
import { useDateUtils, type DayData } from '@/composables/useDateUtils'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import { useWeeklyViewStore } from '@/stores/weeklyViewStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const { fetchStations, fetchStationById, getStationSummaries } = useRentalService()
const { buildWeekDays, getPreviousWeek, getNextWeek } = useDateUtils()
const { handleDragStart, handleDrop: handleDropBase } = useDragAndDrop()
const weeklyStore = useWeeklyViewStore()

const weekDays = ref<DayData[]>([])
const stations = ref<Station[]>([])
const allStations = ref<{ id: string; name: string }[]>([])
const error = ref('')
const loading = ref(true)
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768 || 'ontouchstart' in window
}

const handleMobileClick = (stationId: string, bookingId: string) => {
  if (!isMobile.value) {
    router.push(`/stations/${stationId}/bookings/${bookingId}`)
  }
}

const navigateToBooking = (stationId: string, bookingId: string) => {
  router.push(`/stations/${stationId}/bookings/${bookingId}`)
}

const onStationSelect = async (item: { id: string; name: string } | null) => {
  try {
    if (item?.id) {
      const station = await fetchStationById(item.id)
      stations.value = [station]
    } else {
      const allStationsData = await fetchStations()
      stations.value = allStationsData
    }
    buildWeek()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  }
}

const buildWeek = () => {
  weekDays.value = buildWeekDays(weeklyStore.currentWeekStart.value, stations.value)
}

const showPreviousWeek = () => {
  const newDate = getPreviousWeek(weeklyStore.currentWeekStart.value)
  weeklyStore.setCurrentWeek(newDate)
  buildWeek()
}

const showNextWeek = () => {
  const newDate = getNextWeek(weeklyStore.currentWeekStart.value)
  weeklyStore.setCurrentWeek(newDate)
  buildWeek()
}

const goToToday = () => {
  weeklyStore.resetToDefaults()
  buildWeek()
}

const handleDateChange = (booking: Booking, type: 'start' | 'end', newDate: string) => {
  if (type === 'start') {
    booking.startDate = newDate
  } else if (type === 'end') {
    booking.endDate = newDate
  }
  buildWeek()
}

const handleDrop = (targetDateStr: string) => {
  handleDropBase(targetDateStr, handleDateChange)
}

onMounted(async () => {
  try {
    loading.value = true

    weeklyStore.loadFromStorage()

    const stationsData = await fetchStations()
    stations.value = stationsData
    allStations.value = getStationSummaries(stationsData)

    buildWeek()

    checkMobile()

    window.addEventListener('resize', checkMobile)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>
