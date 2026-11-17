// The name the packed list is saved under in the browser.
export const GO_BAG_STORAGE_KEY = 'kiwi-watch-go-bag'

// Just the two things we need from the browser's localStorage.
export interface SimpleStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

// Checks that something is a list of text values.
function isListOfStrings(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((entry) => typeof entry === 'string')
  )
}

// Gets the ids of the packed items. If nothing is saved, the saved data is
// damaged, or the browser blocks storage, we start with an empty bag.
export function loadPackedIds(storage: SimpleStorage): string[] {
  try {
    const saved = storage.getItem(GO_BAG_STORAGE_KEY)
    if (saved === null) {
      return []
    }

    const parsed: unknown = JSON.parse(saved)
    return isListOfStrings(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Saves the ids of the packed items. If the browser blocks storage,
// the bag still works, it just won't be remembered.
export function savePackedIds(storage: SimpleStorage, packedIds: string[]) {
  try {
    storage.setItem(GO_BAG_STORAGE_KEY, JSON.stringify(packedIds))
  } catch {
    // Nothing to do. Not being able to save isn't worth crashing for.
  }
}
