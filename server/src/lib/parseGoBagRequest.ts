// The longest item id we accept. Our own ids are much shorter than this.
const MAX_ITEM_ID_LENGTH = 50

// Checks the item id from the address. Our ids are lowercase letters, numbers and dashes
// (like "power-bank"). Gives the id back if it's fine, or null if it isn't.
export function parseItemId(itemId: unknown): string | null {
  if (typeof itemId !== 'string') {
    return null
  }
  if (itemId.length === 0 || itemId.length > MAX_ITEM_ID_LENGTH) {
    return null
  }
  if (!/^[a-z0-9-]+$/.test(itemId)) {
    return null
  }
  return itemId
}

// Checks the body of a request to pack or unpack an item, which should look like
// { "packed": true }. Gives back true or false, or null if the body isn't right.
export function parsePacked(body: unknown): boolean | null {
  if (typeof body !== 'object' || body === null) {
    return null
  }

  const { packed } = body as { packed?: unknown }
  return typeof packed === 'boolean' ? packed : null
}
