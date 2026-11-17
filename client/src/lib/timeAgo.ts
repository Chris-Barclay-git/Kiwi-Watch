// Turns a time into short, friendly text like "5 min ago".
// "now" is passed in (not read inside the function) so tests can use a fixed time.

const SECONDS_PER_MINUTE = 60
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR

export function timeAgo(isoTime: string, now: Date): string {
  // How many whole seconds have passed since the quake?
  const secondsAgo = Math.floor(
    (now.getTime() - new Date(isoTime).getTime()) / 1000,
  )

  if (secondsAgo < SECONDS_PER_MINUTE) {
    return 'just now'
  }
  if (secondsAgo < SECONDS_PER_HOUR) {
    return `${Math.floor(secondsAgo / SECONDS_PER_MINUTE)} min ago`
  }
  if (secondsAgo < SECONDS_PER_DAY) {
    return `${Math.floor(secondsAgo / SECONDS_PER_HOUR)} hr ago`
  }

  const daysAgo = Math.floor(secondsAgo / SECONDS_PER_DAY)
  return daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`
}
