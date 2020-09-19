<template>
  <div class="flex-col">
    <div v-if="!isLoading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            v-if="!isLoading"
            :src="
              computedLogo
            "
            :alt="asset.name"
            class="w-20 h-20 mr-5"
          />
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
          </h1>
        </div>
      </div>

      <div class="my-10 flex flex-col">
        <ul>
          <li class="flex justify-between">
            <b class="text-gray-600 mr-10 uppercase">Ranking</b>
            <span>#{{ asset.rank }}</span>
          </li>
          <li class="flex justify-between">
            <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
            <span>{{  dollarFilter(asset.priceUsd) }}</span>
          </li>
          <li class="flex justify-between">
            <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
            <span>{{ dollarFilter(min) }}</span>
          </li>
          <li class="flex justify-between">
            <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
            <span>{{ dollarFilter(max) }}</span>
          </li>
          <li class="flex justify-between">
            <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
            <span>{{ dollarFilter(avg) }}</span>
          </li>
          <li class="flex justify-between">
            <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
            <span>{{ percentFilter(asset.changePercent24Hr) }}</span>
          </li>
        </ul>
      </div>

      <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
        <button
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          @click="toggleConverter"
        >
          Cambiar
        </button>

        <div class="flex flex-row my-5">
          <label class="w-full" for="convertValue">
            <input
              v-model="convertValue"
              id="convertValue"
              type="number"
              class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
              :placeholder="`Valor en ${fromUsd ? 'USD' : asset.symbol}`"
            />
          </label>
        </div>

        <span class="text-xl">{{ convertResult }} {{ fromUsd ? asset.symbol : 'USD' }}</span>
      </div>

      <h3 class="text-xl my-10">Mejores Ofertas de Cambio</h3>
      <table>
        <tr
          v-for="(m, index) in markets"
          :key="`${m.exchangeId}-${m.priceUsd}`"
          class="border-b"
        >
          <td>
            <b>{{ m.exchangeId }}</b>
          </td>
          <td>{{ dollarFilter(m.priceUsd) }}</td>
          <td>{{ m.baseSymbol }} / {{ m.quoteSymbol }}</td>
          <td>
            <px-button
              :is-loading="m.isLoading || false"
              v-if="!m.url"
              @click="getWebSite(m, index)"
            >
              <slot>Obtener Link</slot>
            </px-button>

            <a
              v-else
              class="hover:underline text-green-600"
              :href="m.url"
              target="_blank"
            >
              {{ m.url }}
            </a>
          </td>
        </tr>
      </table>
    </div>
    <div v-else>
      <p>
        Loading...
      </p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'
import useFilters from '@/composables/useFilters'
import PxButton from '@/components/PxButton.vue'

export default defineComponent({
  name: 'CoinDetail',
  components: {
    PxButton
  },
  setup (_, context) {
    const route = useRoute()
    const router = useRouter()
    const asset = ref({})
    const history = ref([])
    const markets = ref([])
    const isLoading = ref(false)
    const fromUsd = ref(true)
    const convertValue = ref(null)

    const toggleConverter = () => {
      fromUsd.value = !fromUsd.value
    }

    const computedLogo = computed(() => {
      if (!asset.value || !asset.value.symbol) {
        return null
      }
      return `https://static.coincap.io/assets/icons/${asset.value.symbol.toLowerCase()}@2x.png`
    })

    const min = computed(() => {
      return Math.min(
        ...history.value.map((h) => parseFloat(h.priceUsd).toFixed(2))
      )
    })

    const max = computed(() => {
      return Math.max(
        ...history.value.map((h) => parseFloat(h.priceUsd).toFixed(2))
      )
    })

    const avg = computed(() => {
      return Math.abs(
        ...history.value.map((h) => parseFloat(h.priceUsd).toFixed(2))
      )
    })

    const chartData = computed(() => {
      const data = []
      history.value.map(h => {
        data.push([h.date, parseFloat(h.priceUsd).toFixed(2)])
      })

      return data
    })

    const convertResult = computed(() => {
      if (!convertValue.value) {
        return 0
      }

      const result = fromUsd.value
        ? convertValue.value / asset.value.priceUsd
        : convertValue.value * asset.value.priceUsd

      return result.toFixed(4)
    })

    const getCoin = async () => {
      try {
        isLoading.value = true
        const id = route.params.id

        const assetApi = await api.getAsset(id)
        const historyApi = await api.getAssetHistory(id)
        const marketsApi = await api.getMarkets(id)

        asset.value = await assetApi

        if (!asset.value) {
          router.push('/error')
        }

        history.value = await historyApi
        markets.value = await marketsApi
        isLoading.value = false
      } catch (error) {
        throw new Error()
      }
    }

    async function getWebSite (exchange, index) {
      const response = await api.getExchange(exchange.exchangeId)
      const url = await response.exchangeUrl
      markets.value[index].url = url
    }

    onMounted(async () => {
      await getCoin()
    })

    watch(
      () => route.params,
      async () => {
        try {
          await getCoin()
        } catch (error) {
          window.location.href = '/'
        }
      }
    )

    return {
      asset,
      history,
      markets,
      isLoading,
      fromUsd,
      convertValue,
      min,
      max,
      avg,
      chartData,
      convertResult,
      getWebSite,
      computedLogo,
      toggleConverter,
      ...useFilters()
    }
  }
})
</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>
