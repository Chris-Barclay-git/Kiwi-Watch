// The parts of GeoNet's response that we use. GeoNet sends more fields than this;
// we only describe what we read.

export interface GeoNetFeature {
  geometry: {
    // GeoJSON puts longitude FIRST, then latitude.
    coordinates: [longitude: number, latitude: number]
  }
  properties: {
    publicID: string
    time: string // ISO date string
    depth: number // km, often with a long decimal tail
    magnitude: number // also with a long decimal tail
    mmi: number // shaking intensity, -1 to 8
    locality: string // e.g. "5 km north-west of Taupo"
    quality: 'best' | 'preliminary' | 'automatic' | 'deleted'
  }
}

export interface GeoNetResponse {
  features: GeoNetFeature[]
}
