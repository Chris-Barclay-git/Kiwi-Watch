import { XMLParser } from 'fast-xml-parser'
import type { GeoPoint, Warning, WarningLevel } from '../types/warning'

// The parts of a CAP alert that we read. CAP has more fields than this.
interface CapParameter {
  valueName: string
  value: string
}

interface CapArea {
  areaDesc: string
  polygon?: string[]
}

interface CapInfo {
  headline: string
  description: string
  instruction?: string
  onset?: string
  expires?: string
  parameter?: CapParameter[]
  area?: CapArea[]
}

interface CapAlert {
  identifier: string
  sent: string
  status: string
  msgType: string
  info?: CapInfo[]
}

// These tags can appear once or many times in the XML.
// Listing them here means we always get a list, even when there is only one.
const parser = new XMLParser({
  ignoreAttributes: true,
  parseTagValue: false, // keep everything as plain text
  isArray: (tagName) =>
    ['info', 'area', 'polygon', 'parameter'].includes(tagName),
})

// MetService puts the colour in a parameter called "ColourCode".
function findParameter(
  parameters: CapParameter[] = [],
  name: string,
): string | undefined {
  return parameters.find((parameter) => parameter.valueName === name)?.value
}

function toLevel(colourCode: string | undefined): WarningLevel | null {
  const colour = colourCode?.toLowerCase()
  if (colour === 'yellow' || colour === 'orange' || colour === 'red')
    return colour
  return null
}

// CAP writes a polygon as "lat,lng lat,lng lat,lng ...".
function polygonTextToPoints(text: string): GeoPoint[] {
  return text
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [latitude, longitude] = pair.split(',')
      return { latitude: Number(latitude), longitude: Number(longitude) }
    })
}

// Turns one CAP alert (XML text) into our Warning shape.
// Gives back null when the alert isn't something we should show:
// a test, a cancellation, or a colour we don't know.
export function capToWarning(xml: string): Warning | null {
  const alert = (parser.parse(xml) as { alert?: CapAlert }).alert
  const info = alert?.info?.[0]
  if (!alert || !info) return null

  if (alert.status !== 'Actual' || alert.msgType === 'Cancel') return null

  const level = toLevel(findParameter(info.parameter, 'ColourCode'))
  if (level === null) return null

  const areas = info.area ?? []

  return {
    id: alert.identifier,
    headline: info.headline,
    level,
    description: info.description,
    instruction: info.instruction ?? '',
    areaDescription: areas.map((area) => area.areaDesc).join('; '),
    onset: info.onset ?? alert.sent,
    expires: info.expires ?? '',
    polygons: areas.flatMap((area) =>
      (area.polygon ?? []).map(polygonTextToPoints),
    ),
  }
}
