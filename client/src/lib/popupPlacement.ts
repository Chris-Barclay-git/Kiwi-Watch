// Decides which side of a quake marker its info card should sit on,
// so the card never gets cut off at the edge of the map.

export type Vertical = 'above' | 'below'
export type Horizontal = 'left' | 'center' | 'right'

export interface PopupPlacement {
  vertical: Vertical
  horizontal: Horizontal
}

// A marker in the top quarter of the map has no room above it, so the card goes below.
const TOP_EDGE_FRACTION = 0.25

// A marker in the outer 30% on either side gets a card that lines up with that edge.
const SIDE_EDGE_FRACTION = 0.3

export function popupPlacement(
  point: { x: number; y: number },
  mapWidth: number,
  mapHeight: number,
): PopupPlacement {
  // How far across and down the map is the marker? 0 = left/top edge, 1 = right/bottom edge.
  const fractionAcross = point.x / mapWidth
  const fractionDown = point.y / mapHeight

  const vertical: Vertical =
    fractionDown < TOP_EDGE_FRACTION ? 'below' : 'above'

  let horizontal: Horizontal = 'center'
  if (fractionAcross < SIDE_EDGE_FRACTION) {
    horizontal = 'left'
  } else if (fractionAcross > 1 - SIDE_EDGE_FRACTION) {
    horizontal = 'right'
  }

  return { vertical, horizontal }
}
