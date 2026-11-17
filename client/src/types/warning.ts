// How bad a MetService warning is:
// yellow = Watch, orange = Warning, red = the most extreme Warning.
export type WarningLevel = 'yellow' | 'orange' | 'red'

// One point on the map, named the same way as in our Quake type.
export interface GeoPoint {
  latitude: number
  longitude: number
}

// One weather warning or watch, as our server sends it.
export interface Warning {
  id: string
  headline: string // e.g. "Heavy Rain Watch"
  level: WarningLevel
  description: string
  instruction: string // e.g. "Action: Monitor for updates."
  areaDescription: string // e.g. "The ranges of Bay of Plenty east of Opotiki..."
  onset: string // when it starts, ISO date string
  expires: string // when it ends, ISO date string
  polygons: GeoPoint[][] // the shapes to colour in on the map
}
