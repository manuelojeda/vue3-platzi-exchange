const API_URL = 'https://api.coincap.io/v2'

async function getAssets () {
  let RESPONSE = await fetch(`${API_URL}/assets?limit=20`)
  RESPONSE = await RESPONSE.json()
  return RESPONSE.data
}

async function getAsset (coin) {
  let RESPONSE = await fetch(`${API_URL}/assets/${coin}`)
  RESPONSE = await RESPONSE.json()
  return RESPONSE.data
}

async function getAssetHistory (coin) {
  const now = new Date()
  const end = now.getTime()
  now.setDate(now.getDate() - 1)
  const start = now.getTime()

  let RESPONSE = await fetch(`
    ${API_URL}/assets/${coin}/history?interval=h1&start=${start}&end=${end}
  `)

  RESPONSE = await RESPONSE.json()
  return RESPONSE.data
}

async function getMarkets (coin) {
  let RESPONSE = await fetch(`${API_URL}/assets/${coin}/markets?limit=5`)
  RESPONSE = await RESPONSE.json()
  return RESPONSE.data
}

const getExchange = async id => {
  let RESPONSE = await fetch(`${API_URL}/exchanges/${id}`)
  RESPONSE = await RESPONSE.json()
  return RESPONSE.data
}

export default {
  getAssets,
  getAsset,
  getAssetHistory,
  getMarkets,
  getExchange
}
