import type { GeoNetResponse } from '../types/geonet'
import type { Quake } from '../types/quake'
import { geonetToQuakes } from './geonetToQuakes'

const GEONET_QUAKE_URL = 'https://api.geonet.org.nz/quake?MMI=3'
// Asks GeoNet for version 2 of its quake data, which is the shape our types describe.
const GEONET_ACCEPT_HEADER = 'application/vnd.geo+json;version=2'

// Asks GeoNet for recent quakes and gives them back in our own shape.
// `fetchFunction` defaults to the real fetch. Tests pass in a fake one.
export async function fetchQuakes(
  fetchFunction: typeof fetch = fetch,
): Promise<Quake[]> {
  const response = await fetchFunction(GEONET_QUAKE_URL, {
    headers: { Accept: GEONET_ACCEPT_HEADER },
  })

  // If GeoNet says something went wrong, stop and report it.
  if (!response.ok) {
    throw new Error(`GeoNet responded with status ${response.status}`)
  }

  const data = (await response.json()) as GeoNetResponse
  return geonetToQuakes(data)
}
