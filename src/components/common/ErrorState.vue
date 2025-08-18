<template>
  <div class="text-center py-8 md:py-12">
    <div class="error-message">
      <p class="error-text">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
}

defineProps<Props>()
</script>
