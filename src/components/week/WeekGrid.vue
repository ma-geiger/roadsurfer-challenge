<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
    <div
      v-for="day in weekDays"
      :key="day.date"
      class="day-card"
      @dragover.prevent
      @drop="$emit('drop', day.date)"
      @drop.prevent
    >
      <div class="day-card-header">
        <div class="day-card-header-date">
          {{ day.date }}
        </div>
        <div class="day-card-header-day">
          {{ day.weekday }} {{ day.isCurrentDay ? '- (Today)' : '' }}
        </div>
      </div>

      <div class="day-card-content">
        <div v-if="day.bookings.length === 0" class="day-card-no-bookings">No bookings</div>

        <router-link
          v-for="entry in day.bookings"
          :key="entry.booking.id + '-' + entry.type"
          :to="isMobile ? '' : `stations/${entry.station}/bookings/${entry.booking.id}`"
          :class="['booking-item', isMobile ? 'booking-item-mobile' : 'booking-item-desktop']"
          draggable="true"
          @dragstart="$emit('dragStart', entry.booking, entry.type)"
          @click="
            isMobile
              ? $event.preventDefault()
              : $emit('bookingClick', entry.station, entry.booking.id)
          "
        >
          <i
            v-if="isMobile"
            style="color: var(--color-white)"
            @click.prevent="$emit('mobileClick', entry.station, entry.booking.id)"
            class="fa fa-arrow-right fa-lg absolute top-2 right-2"
          ></i>

          <div class="booking-item-name">{{ entry.booking.customerName }}</div>
          <div class="text-xs opacity-75 mt-1">
            {{ entry.type === 'start' ? 'Pickup' : 'Return' }}
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DayData, BookingEntry } from '@/composables/useDateUtils'

interface Props {
  weekDays: DayData[]
  isMobile: boolean
}

interface Emits {
  drop: [date: string]
  dragStart: [booking: BookingEntry['booking'], type: 'start' | 'end']
  bookingClick: [stationId: string, bookingId: string]
  mobileClick: [stationId: string, bookingId: string]
}

defineProps<Props>()
defineEmits<Emits>()
</script>
