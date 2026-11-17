import type { Quake } from '../types/quake'

// Gives a time that many minutes before "now", as an ISO string.
// This keeps the fake quakes looking recent whenever you open the app.
function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString()
}

// Fake quakes shaped like the real thing, so we can build the map before the server exists.
export const mockQuakes: Quake[] = [
  {
    id: 'mock-1',
    magnitude: 4.2,
    depthKm: 12,
    locality: '15 km north-east of Kaikōura',
    time: minutesAgo(4),
    latitude: -42.3,
    longitude: 173.84,
    mmi: 4,
  },
  {
    id: 'mock-2',
    magnitude: 3.1,
    depthKm: 6,
    locality: '5 km north of Taupō',
    time: minutesAgo(35),
    latitude: -38.64,
    longitude: 176.07,
    mmi: 3,
  },
  {
    id: 'mock-3',
    magnitude: 2.8,
    depthKm: 25,
    locality: '10 km south-west of Wellington',
    time: minutesAgo(130),
    latitude: -41.35,
    longitude: 174.7,
    mmi: 2,
  },
  {
    id: 'mock-4',
    magnitude: 5.0,
    depthKm: 30,
    locality: '30 km south-west of Milford Sound',
    time: minutesAgo(400),
    latitude: -44.9,
    longitude: 167.5,
    mmi: 5,
  },
  {
    id: 'mock-5',
    magnitude: 3.6,
    depthKm: 18,
    locality: '20 km north-east of Te Araroa',
    time: minutesAgo(1500),
    latitude: -37.5,
    longitude: 178.5,
    mmi: 3,
  },
  {
    // Off the edge of our map, to check we handle it gracefully.
    id: 'mock-6',
    magnitude: 4.8,
    depthKm: 90,
    locality: 'Kermadec Islands',
    time: minutesAgo(3000),
    latitude: -30.5,
    longitude: -177.9,
    mmi: 2,
  },
]
