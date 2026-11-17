// The shape of one earthquake as our app sees it.
// This matches the Quake type in the client, so the server's output
// can be used by the React app as it is.
export interface Quake {
  id: string
  magnitude: number
  depthKm: number
  locality: string
  time: string // ISO date string
  latitude: number
  longitude: number
  mmi: number
}
