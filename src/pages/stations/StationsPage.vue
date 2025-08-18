<template>
  <div class="container-padding max-w-6xl mx-auto">
    <div class="section-margin">
      <h1 class="text-heading">Stations</h1>
    </div>

    <div v-if="loading" class="text-center py-8 md:py-12">
      <div class="loading-spinner"></div>
      <p class="mt-2 text-sm md:text-base" style="color: var(--color-text-muted)">
        Loading stations...
      </p>
    </div>

    <div v-else-if="error" class="text-center py-8 md:py-12">
      <div class="error-message">
        <p class="error-text">{{ error }}</p>
      </div>
    </div>

    <div v-else class="grid-responsive">
      <router-link
        v-for="station in stationNames"
        :key="station.id"
        :to="`/stations/${station.id}`"
        class="card flex flex-col justify-between card-content hover:shadow-lg transition-shadow duration-200"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-lg md:text-xl font-semibold" style="color: var(--color-text)">
            {{ station.name }}
          </h3>
          <div class="flex flex-col text-right">
            <span class="text-xs md:text-sm" style="color: var(--color-text-muted)">
              ID: {{ station.id }}
            </span>
            <span class="text-xs md:text-sm" style="color: var(--color-text-muted)">
              Bookings: {{ station.numberOfBookings }}
            </span>
          </div>
        </div>
      </router-link>
    </div>

    <div v-if="!loading && !error && stationNames.length === 0" class="text-center py-8 md:py-12">
      <div
        class="rounded-lg p-4 md:p-6 max-w-md mx-auto"
        style="background-color: var(--color-bg-gray); border: 1px solid var(--color-light-gray)"
      >
        <p class="text-sm md:text-base" style="color: var(--color-text-muted)">No stations found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRentalService, type Station } from '@/services/rentalService'

const { fetchStations } = useRentalService()

interface StationSummary {
  name: string
  id: string
  numberOfBookings: number
}

const stationNames = ref<StationSummary[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const data = await fetchStations()

    const stations = data
      .map((station: Station) => ({
        name: station.name !== 'station-name{{i}}' ? station.name : null,
        id: station.id,
        numberOfBookings: station.bookings.length,
      }))
      .filter((station): station is StationSummary => station.name !== null)

    stationNames.value = stations
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
})
</script>
