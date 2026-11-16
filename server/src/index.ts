import { createApp } from './app'
import { createCache } from './lib/createCache'
import { createGetQuakes } from './lib/createGetQuakes'
import { fetchQuakes } from './lib/fetchQuakes'
import type { Quake } from './types/quake'

const PORT = 3001
const ONE_MINUTE = 60_000

// Put the pieces together:
// cache (holds quakes for a minute) + GeoNet fetcher -> getQuakes -> the app
const cache = createCache<Quake[]>(ONE_MINUTE)
const getQuakes = createGetQuakes(() => fetchQuakes(), cache)
const app = createApp(getQuakes)

app.listen(PORT, () => {
  console.log(`Kiwi Watch server running at http://localhost:${PORT}`)
})
