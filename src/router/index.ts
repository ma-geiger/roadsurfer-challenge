import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import BookingDetail from '@/pages/booking/BookingDetail.vue'
import StationDetail from '@/pages/stations/StationDetail.vue'
import StationsPage from '@/pages/stations/StationsPage.vue'

const historyMode = import.meta.env.DEV
  ? createWebHistory(import.meta.env.BASE_URL)
  : createWebHashHistory(import.meta.env.BASE_URL)

const router = createRouter({
  history: historyMode,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
    },
    {
      path: '/stations',
      name: 'Stations',
      component: StationsPage,
      props: true,
    },
    {
      path: '/stations/:stationId',
      name: 'StationDetail',
      component: StationDetail,
      props: true,
    },
    {
      path: '/stations/:stationId/bookings/:bookingId',
      name: 'BookingDetail',
      component: BookingDetail,
      props: true,
    },
  ],
})

export default router
