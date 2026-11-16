// Decides how big a quake's pulse ring should be on the map.
// Bigger quake = bigger ring. Sizes are in map units (the same units as projectToMap).

const SMALLEST_MAGNITUDE = 1
const LARGEST_MAGNITUDE = 8

const SMALLEST_RING = 6
const LARGEST_RING = 40

export function magnitudeToRingSize(magnitude: number): number {
  // Keep the magnitude inside our range so odd values can't make a tiny or giant ring.
  const clampedMagnitude = Math.min(
    Math.max(magnitude, SMALLEST_MAGNITUDE),
    LARGEST_MAGNITUDE,
  )

  // How far up the range is it? 0 = smallest, 1 = largest.
  const fractionOfRange =
    (clampedMagnitude - SMALLEST_MAGNITUDE) /
    (LARGEST_MAGNITUDE - SMALLEST_MAGNITUDE)

  return SMALLEST_RING + fractionOfRange * (LARGEST_RING - SMALLEST_RING)
}
