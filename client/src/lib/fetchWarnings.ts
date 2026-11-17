import type { Warning } from '../types/warning'

// Asks our own server for the current weather watches and warnings.
// `fetchFunction` defaults to the real fetch. Tests pass in a fake one.
export async function fetchWarnings(
  fetchFunction: typeof fetch = fetch,
): Promise<Warning[]> {
  const response = await fetchFunction('/api/warnings')

  // If the server says something went wrong, stop and report it.
  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`)
  }

  return (await response.json()) as Warning[]
}
