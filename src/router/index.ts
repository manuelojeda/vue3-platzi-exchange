import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import CoinDetail from '../views/CoinDetail.vue'
import ErrorView from '../views/Error.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/coin/:id',
    name: 'coin-detail',
    component: CoinDetail
  },
  {
    path: '/error',
    component: ErrorView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
