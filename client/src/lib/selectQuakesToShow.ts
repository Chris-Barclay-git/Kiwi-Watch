// The least a quake needs to be pinned at the top of the list, and how many of each we show.
export const QUAKE_LIST_OPTIONS = {
  minNotableMagnitude: 4.5,
  notableCount: 3,
  recentCount: 8,
}

interface QuakeLike {
  id: string
  magnitude: number
}

interface QuakeListOptions {
  minNotableMagnitude: number // quakes at or above this are "notable"
  notableCount: number // how many notable quakes to pin
  recentCount: number // how many recent quakes to show after them
}

interface QuakesToShow<T> {
  notable: T[] // the newest notable quakes
  recent: T[] // the newest of the rest
}

// Decides which quakes the list shows: the newest few big ones, then the newest few of
// everything else. A quake pinned as notable is not shown again in the recent ones.
// The quakes must be given newest first (our server already sends them that way).
export function selectQuakesToShow<T extends QuakeLike>(
  quakesNewestFirst: T[],
  options: QuakeListOptions,
): QuakesToShow<T> {
  const notable = quakesNewestFirst
    .filter((quake) => quake.magnitude >= options.minNotableMagnitude)
    .slice(0, options.notableCount)

  const notableIds = new Set(notable.map((quake) => quake.id))

  const recent = quakesNewestFirst
    .filter((quake) => !notableIds.has(quake.id))
    .slice(0, options.recentCount)

  return { notable, recent }
}
