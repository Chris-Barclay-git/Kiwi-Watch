import type { Quake } from '../types/quake'

// Asks our own server for the recent quakes.
// `fetchFunction` defaults to the real fetch. Tests pass in a fake one.
export async function fetchQuakes(
  fetchFunction: typeof fetch = fetch,
): Promise<Quake[]> {
  const response = await fetchFunction('/api/quakes')

  // If the server says something went wrong, stop and report it.
  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`)
  }

  return (await response.json()) as Quake[]
}
