<template>
  <AppLayout>
    <template #main>
      <router-view />
    </template>
  </AppLayout>
</template>

<script setup lang="ts">
import { AppLayout } from '@/components/layout'
</script>
