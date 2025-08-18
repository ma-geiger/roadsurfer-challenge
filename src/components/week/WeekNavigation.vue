<template>
  <div class="flex justify-between gap-3 md:gap-4">
    <button @click="$emit('previous')" class="nav-link w-full">
      <i class="fa fa-arrow-left mr-2"></i>
      <span class="hidden md:inline">Previous Week</span>
    </button>

    <button @click="$emit('today')" class="nav-link w-full">
      <i class="fa fa-calendar mr-2"></i>
      Today
    </button>

    <button @click="$emit('next')" class="nav-link w-full">
      <span class="hidden md:inline">Next Week</span>
      <i class="fa fa-arrow-right ml-2"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  previous: []
  today: []
  next: []
}>()
</script>
