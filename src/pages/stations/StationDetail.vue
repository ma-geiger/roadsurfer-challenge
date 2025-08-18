<template>
  <div class="container-padding max-w-4xl mx-auto">
    <div class="section-margin">
      <h1 class="text-heading">Station Details - {{ stationName }}</h1>
      <p class="text-subheading">Station ID: {{ stationId }}</p>
      <p class="text-subheading">Bookings: {{ bookings.length }}</p>
    </div>

    <div class="card card-content">
      <h3 class="card-header">Bookings</h3>

      <div v-if="loading" class="text-center py-6 md:py-8">
        <div class="loading-spinner"></div>
        <p class="mt-2 text-sm md:text-base" style="color: var(--color-text-muted)">
          Loading booking details...
        </p>
      </div>

      <div v-else-if="error" class="text-center py-6 md:py-8">
        <div class="error-message">
          <p class="error-text">{{ error }}</p>
        </div>
      </div>

      <div v-else class="space-y-3 md:space-y-4">
        <router-link
          :to="`/stations/${stationId}/bookings/${booking.id}`"
          v-for="booking in bookings"
          :key="booking.id"
          class="block p-3 md:p-4 hover:shadow-md card card-content"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h4 class="font-semibold mb-2 text-sm md:text-base" style="color: var(--color-text)">
                {{ booking.customerName }}
              </h4>
              <div
                class="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm"
                style="color: var(--color-text-muted)"
              >
                <div>
                  <span class="font-medium">Start Date:</span>
                  <span class="ml-2">{{
                    booking.startDate ? booking.startDate.split('T')[0] : 'Not set'
                  }}</span>
                </div>
                <div>
                  <span class="font-medium">End Date:</span>
                  <span class="ml-2">{{
                    booking.endDate ? booking.endDate.split('T')[0] : 'Not set'
                  }}</span>
                </div>
              </div>
            </div>
            <i class="fa fa-arrow-right fa-lg"></i>
          </div>
        </router-link>

        <div
          v-if="bookings.length === 0"
          class="text-center py-6 md:py-8 text-sm md:text-base"
          style="color: var(--color-text-muted)"
        >
          No bookings found for this station
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRentalService, type Booking } from '@/services/rentalService'

const props = defineProps<{
  stationId: string
}>()

const { fetchStationById } = useRentalService()
const bookings = ref<Booking[]>([])
const stationName = ref('')
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const station = await fetchStationById(props.stationId)
    bookings.value = station.bookings
    stationName.value = station.name
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
})
</script>
