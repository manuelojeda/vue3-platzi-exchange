<template>
  <div>
    <table>
      <thead>
        <tr class="bg-gray-100 border-b-2 border-gray-400">
          <th></th>
          <th :class="{ up: this.sortOrder === 1, down: this.sortOrder === -1 }">
            <span class="unserline cursor-pointer" @click="changeSortOrder">
              Ranking
            </span>
          </th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Cap. de Mercado</th>
          <th>Variación 24hs</th>
          <td class="hidden sm:block">
            <input
              type="text"
              class="bg-gray-100 focus:outline-none border-b border-gray-400 py-2 px-4 block"
              id="filter"
              placeholder="Buscar..."
              v-model="filter"
            />
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="asset in filteredAssets"
          :key="asset.id"
          class="border-b border-gray-200 hover:bg-gray-100 hover:bg-orange-100"
        >
          <td>
            <img
              :src="
                `https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`
              "
              :alt="asset.name"
              class="w-6 h-6"
            />
          </td>
          <td>
            <b>#{{ asset.rank }}</b>
          </td>
          <td>
            <router-link
              class="hover:underline text-green-600"
              :to="{ name: 'coin-detail', params: { id: asset.id } }"
            >
              {{ asset.name }}
            </router-link>
            <small class="ml-1 text-gray-500">
              {{ asset.symbol }}
            </small>
          </td>
          <td>{{ dollarFilter(asset.priceUsd) }}</td>
          <td>{{ dollarFilter(asset.marketCapUsd) }}</td>
          <td
            :class="asset.changePercent24Hr.includes('-') ? 'text-red-600' : 'text-green-600'"
          >
            {{ percentFilter(asset.changePercent24Hr) }}
          </td>
          <td class="hidden sm:block">
            <px-button @click="goToCoin(asset)">
              <span>
                Detalle
              </span>
            </px-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import PxButton from '@/components/PxButton.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PxAssetsTable',
  props: {
    assets: {
      type: Array,
      default: () => []
    }
  },
  components: {
    PxButton
  }
})
</script>

<script setup="props, context" lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useFilters from '../composables/useFilters'

export const filter = ref<string>('')
export const sortOrder = ref<any>(1)

export function goToCoin ({ id }: { id: number}) {
  useRouter().push({
    name: 'coin-detail',
    params: { id }
  })
}

export function changeSortOrder () {
  sortOrder.value = parseInt(sortOrder.value) * -1
}

export const filteredAssets = computed(() => {
  const altOrder = sortOrder.value === 1 ? -1 : 1

  return props.assets
    .filter(
      (a: any) =>
        a.name.toLowerCase().includes(filter.value.toLowerCase()) ||
        a.symbol.toLowerCase().includes(filter.value.toLowerCase())
    )
    .sort((a: any, b: any) => {
      if (parseInt(a.rank) > parseInt(b.rank)) {
        return sortOrder.value
      }
      return altOrder
    })
})

export const dollarFilter = useFilters().dollarFilter
export const percentFilter = useFilters().percentFilter
</script>

<style scoped>
.up::before {
  content: '👆';
}

.down::before {
  content: '👇';
}

td {
  padding: 20px 0px;
  font-size: 0.6rem;
  text-align: center;
}

th {
  padding: 5px;
  font-size: 0.6rem;
}

@media (min-width: 640px) {
  td,
  th {
    padding: 20px;
    font-size: 1rem;
  }

  th {
    padding: 12px;
  }
}
</style>
