// What the cache must be able to do. createCache gives us exactly this.
interface Cache<T> {
  get(): T | null
  set(value: T): void
}

// Builds a function that gets something (quakes, warnings...) using the cache when it can.
// 1. If the cache holds a fresh value, return that. The outside service isn't called.
// 2. Otherwise fetch a fresh value, save it in the cache, and return it.
export function createCachedGetter<T>(
  fetchFresh: () => Promise<T>,
  cache: Cache<T>,
) {
  return async function getCached(): Promise<T> {
    const cachedValue = cache.get()
    if (cachedValue !== null) return cachedValue

    const freshValue = await fetchFresh()
    cache.set(freshValue)
    return freshValue
  }
}
