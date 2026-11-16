// Turns a real-world latitude/longitude into an x/y position on our cute SVG map.
// It only needs to be roughly right, not survey-accurate.

export interface Point {
  x: number
  y: number
}

// The slice of the world our map shows: all of NZ plus a bit of sea around it.
export const NZ_BOUNDS = {
  north: -33.5,
  south: -48.5,
  west: 165.5,
  east: 179.5,
}

export const MAP_WIDTH = 500

// Longitude lines sit closer together the further you are from the equator,
// so one degree of longitude is "shorter" than one degree of latitude here.
// We shrink the width by this amount so NZ isn't stretched sideways.
function widthSquashAtNz(): number {
  const middleLatitude = (NZ_BOUNDS.north + NZ_BOUNDS.south) / 2
  const radians = (middleLatitude * Math.PI) / 180
  return Math.cos(radians)
}

// Work out how tall the map must be to keep NZ's proportions.
const degreesWide = NZ_BOUNDS.east - NZ_BOUNDS.west
const degreesTall = NZ_BOUNDS.north - NZ_BOUNDS.south
export const MAP_HEIGHT = Math.round(
  (MAP_WIDTH * degreesTall) / (degreesWide * widthSquashAtNz()),
)

export function isInsideMap(latitude: number, longitude: number): boolean {
  const isBetweenNorthAndSouth =
    latitude <= NZ_BOUNDS.north && latitude >= NZ_BOUNDS.south
  const isBetweenWestAndEast =
    longitude >= NZ_BOUNDS.west && longitude <= NZ_BOUNDS.east
  return isBetweenNorthAndSouth && isBetweenWestAndEast
}

// Returns null if the quake is off the edge of our map (e.g. the Kermadec Islands).
export function projectToMap(
  latitude: number,
  longitude: number,
): Point | null {
  if (!isInsideMap(latitude, longitude)) {
    return null
  }

  // How far along the map is it? 0 = left/top edge, 1 = right/bottom edge.
  const fractionAcross = (longitude - NZ_BOUNDS.west) / degreesWide
  // North is the top of the map, so we measure down from the north edge.
  const fractionDown = (NZ_BOUNDS.north - latitude) / degreesTall

  return {
    x: fractionAcross * MAP_WIDTH,
    y: fractionDown * MAP_HEIGHT,
  }
}
