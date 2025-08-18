<template>
  <div class="flex flex-col min-h-screen">
    <header class="sticky top-0 z-50 bg-white px-4 md:px-8 py-4 shadow-lg">
      <div class="flex md:flex-row justify-between items-center w-full gap-4 md:gap-0">
        <router-link
          to="/"
          class="px-3 py-2 md:px-4 md:py-2 text-sm md:text-base font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 hover:shadow-md"
        >
          <h1 class="m-0 text-xl md:text-3xl font-bold" style="color: var(--color-primary)">
            RoadSurfer
          </h1>
          <p class="m-0 text-xs md:text-sm" style="color: var(--color-text-light)">
            Rental Management
          </p>
        </router-link>

        <nav class="flex md:flex-row md:gap-4 items-center">
          <router-link to="/stations" class="nav-link w-full md:w-auto text-center">
            <i class="fa fa-map-signs md:mr-2"></i><span class="hidden md:inline">Stations</span>
          </router-link>
          <router-link to="/" class="nav-link w-full md:w-auto text-center">
            <i class="fa fa-home fa-lg md:fa-2x md:mr-2"></i
            ><span class="hidden md:inline">Home</span>
          </router-link>
        </nav>
      </div>
    </header>

    <main class="flex-1 p-4 md:p-8 overflow-y-auto">
      <slot name="main">
        <router-view />
      </slot>
    </main>
  </div>
</template>

<script setup lang="ts"></script>
