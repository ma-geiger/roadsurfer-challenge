<template>
  <div class="container-padding max-w-4xl mx-auto">
    <div class="section-margin">
      <h1 class="text-heading">Booking Details</h1>
    </div>

    <div v-if="loading" class="text-center py-8 md:py-12">
      <div class="loading-spinner"></div>
      <p class="mt-2 text-sm md:text-base" style="color: var(--color-text-muted)">
        Loading booking details...
      </p>
    </div>

    <div v-else-if="error" class="text-center py-8 md:py-12">
      <div class="error-message">
        <p class="error-text">{{ error }}</p>
      </div>
    </div>

    <div v-else class="card card-content">
      <div class="grid-two-column">
        <div>
          <h3 class="card-header">Customer Information</h3>
          <div class="space-y-2 md:space-y-3">
            <div>
              <label class="form-label">Customer Name</label>
              <p class="text-value">{{ booking.customerName }}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="card-header">Details</h3>
          <div class="space-y-2 md:space-y-3">
            <div>
              <label class="form-label">Station</label>
              <p class="text-value">{{ stationName }}</p>
            </div>
            <div>
              <label class="form-label">Start Date</label>
              <p class="text-value">{{ booking.startDate?.split('T')[0] || 'Not set' }}</p>
            </div>
            <div>
              <label class="form-label">End Date</label>
              <p class="text-value">{{ booking.endDate?.split('T')[0] || 'Not set' }}</p>
            </div>
            <div>
              <label class="form-label">Rental Duration</label>
              <p class="text-value">{{ rentalDuration }} days</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 md:mt-8 pt-4 md:pt-6" style="border-top: 1px solid var(--color-light-gray)">
        <div class="flex sm:flex-row gap-3 md:gap-4">
          <router-link :to="`/stations/${props.stationId}`" class="nav-link">
            <i class="fa fa-arrow-left mr-2"></i> Station
          </router-link>
          <router-link to="/" class="nav-link">
            <i class="fa fa-arrow-left mr-2"></i> Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRentalService, type Booking } from '@/services/rentalService'

const props = defineProps<{
  stationId: string
  bookingId: string
}>()

const { fetchBookingById, fetchStations } = useRentalService()

const booking = reactive<Booking>({} as Booking)
const stationName = ref('')
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const data = await fetchBookingById(props.stationId, props.bookingId)
    const stations = await fetchStations()
    Object.assign(booking, data)

    const foundStation = stations.find((station) => station.id === props.stationId)
    stationName.value = foundStation?.name || 'Unknown Station'
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
})

const rentalDuration = computed(() => {
  if (!booking.startDate || !booking.endDate) return 0
  const start = new Date(booking.startDate)
  const end = new Date(booking.endDate)
  const diffMs = end.getTime() - start.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
})
</script>
