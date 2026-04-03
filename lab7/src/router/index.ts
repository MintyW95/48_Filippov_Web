import { createRouter, createWebHistory } from 'vue-router'
import BetsView from '../views/BetsView.vue'
import WeatherView from '../views/WeatherView.vue'
import CurrencyView from '../views/CurrencyView.vue'
import SlotView from '../views/SlotView.vue'

const router = createRouter(
{
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'bets',
      component: BetsView
    },
    {
      path: '/weather',
      name: 'weather',
      component: WeatherView
    },
    {
      path: '/currency',
      name: 'currency',
      component: CurrencyView
    },
    {
      path: '/slot',
      name: 'slot',
      component: SlotView
    }
  ]
})

export default router