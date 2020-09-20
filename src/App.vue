<template>
  <main>
    <px-header :links="links" />

    <router-view class="container mx-auto px-5 sm:px-20 py-20 flex justify-center" />
  </main>
</template>

<script>
import PxHeader from '@/components/PxHeader'

export default {
  name: 'app',
  components: { PxHeader }
}
</script>

<script setup>
import { ref } from 'vue'

export const links = ref([
  {
    title: 'BTC',
    to: { name: 'coin-detail', params: { id: 'bitcoin' } }
  },
  {
    title: 'ETH',
    to: { name: 'coin-detail', params: { id: 'ethereum' } }
  },
  {
    title: 'XRP',
    to: { name: 'coin-detail', params: { id: 'xrp' } }
  }
])
</script>
