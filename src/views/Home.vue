<template>
  <px-assets-table :assets="assets" v-if="!isLoading" />
  <div class="text-center" v-else>
    <bounce-loader :loading="isLoading" :color="'#68d391'" :size="100" />
  </div>
</template>

<script lang="ts">
// import { defineComponent, ref, onMounted } from 'vue'
import PxAssetsTable from '../components/PxAssetsTable.vue'
// import api from '../api'

export default ({
  name: 'Home',
  components: {
    PxAssetsTable
  }
})
</script>

<script setup="props, context" lang="ts">
import { ref, onMounted } from 'vue'
import api from '../api'

export const assets = ref([])
export const isLoading = ref<boolean>(true)

onMounted(async () => {
  // console.log(props, context)
  try {
    assets.value = await api.getAssets()
    isLoading.value = false
  } catch (error) {
    return null
  }
})
</script>
