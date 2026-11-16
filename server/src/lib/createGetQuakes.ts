import type { Quake } from '../types/quake'

// The two things this function needs, described by what they do:
type FetchQuakes = () => Promise<Quake[]>

interface QuakeCache {
  get(): Quake[] | null
  set(value: Quake[]): void
}

// Builds a `getQuakes` function that uses the cache when it can.
// 1. If the cache holds fresh quakes, return those. GeoNet isn't called.
// 2. Otherwise ask GeoNet, save the answer in the cache, and return it.
export function createGetQuakes(fetchQuakes: FetchQuakes, cache: QuakeCache) {
  return async function getQuakes(): Promise<Quake[]> {
    const cachedQuakes = cache.get()
    if (cachedQuakes !== null) return cachedQuakes

    const freshQuakes = await fetchQuakes()
    cache.set(freshQuakes)
    return freshQuakes
  }
}
