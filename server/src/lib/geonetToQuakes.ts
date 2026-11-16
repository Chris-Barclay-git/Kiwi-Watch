import type { GeoNetFeature, GeoNetResponse } from '../types/geonet'
import type { Quake } from '../types/quake'

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10
}

// Turns one GeoNet feature into our own Quake shape.
function featureToQuake(feature: GeoNetFeature): Quake {
  // GeoNet gives [longitude, latitude]. We name them so they can't be mixed up.
  const [longitude, latitude] = feature.geometry.coordinates
  const { publicID, time, depth, magnitude, locality, mmi } = feature.properties

  return {
    id: publicID,
    magnitude: roundToOneDecimal(magnitude),
    depthKm: Math.round(depth),
    locality,
    time,
    latitude,
    longitude,
    mmi,
  }
}

// Turns GeoNet's whole response into a list of quakes for our app:
// 1. drop quakes GeoNet has marked "deleted" (retracted)
// 2. convert each one to our shape
// 3. put the newest first
export function geonetToQuakes(response: GeoNetResponse): Quake[] {
  return response.features
    .filter((feature) => feature.properties.quality !== 'deleted')
    .map(featureToQuake)
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
}
