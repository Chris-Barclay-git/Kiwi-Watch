// The shape of one earthquake as our app sees it.
// The server will turn GeoNet's raw data into this shape, so the rest of the app never touches GeoNet's field names.
export interface Quake {
  id: string
  magnitude: number
  depthKm: number
  locality: string // e.g. "15 km north-east of Kaikōura"
  time: string // ISO date string, e.g. "2026-11-17T01:23:45.000Z"
  latitude: number // negative = south of the equator
  longitude: number // east of Greenwich is positive; just past the dateline wraps to negative
  mmi: number // Modified Mercalli Intensity: how strongly it was felt (-1 to 8)
}
