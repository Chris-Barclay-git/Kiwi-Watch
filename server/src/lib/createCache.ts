interface SavedValue<T> {
  value: T
  savedAt: number // time in milliseconds when it was saved
}

// Makes a small cache that holds ONE value for a limited time.
// `getNow` is the clock. It defaults to the real clock, and tests pass in a fake one.
export function createCache<T>(
  maxAgeMs: number,
  getNow: () => number = Date.now,
) {
  let saved: SavedValue<T> | null = null

  // Gives back the saved value if it is still fresh, otherwise null.
  function get(): T | null {
    if (saved === null) return null

    const ageMs = getNow() - saved.savedAt
    return ageMs < maxAgeMs ? saved.value : null
  }

  // Saves a value and starts its timer from now.
  function set(value: T): void {
    saved = { value, savedAt: getNow() }
  }

  return { get, set }
}
