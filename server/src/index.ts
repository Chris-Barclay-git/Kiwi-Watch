import { createApp } from './app'
import { createCache } from './lib/createCache'
import { createCachedGetter } from './lib/createCachedGetter'
import { fetchQuakes } from './lib/fetchQuakes'
import { fetchWarnings } from './lib/fetchWarnings'
import type { Quake } from './types/quake'
import type { Warning } from './types/warning'

const PORT = 3001
const ONE_MINUTE = 60_000
const FIVE_MINUTES = 5 * ONE_MINUTE

// Put the pieces together. Each one is: cache + outside service -> getter.
// Quakes can change any minute. Weather warnings change much less often.
const getQuakes = createCachedGetter(
  () => fetchQuakes(),
  createCache<Quake[]>(ONE_MINUTE),
)
const getWarnings = createCachedGetter(
  () => fetchWarnings(),
  createCache<Warning[]>(FIVE_MINUTES),
)

const app = createApp(getQuakes, getWarnings)

app.listen(PORT, () => {
  console.log(`Kiwi Watch server running at http://localhost:${PORT}`)
})
