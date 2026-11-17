import { XMLParser } from 'fast-xml-parser'
import type { Warning } from '../types/warning'
import { capToWarning } from './capToWarning'

const METSERVICE_FEED_URL = 'https://alerts.metservice.com/cap/rss'
// We only follow links on MetService's own alerts site.
const ALERT_LINK_START = 'https://alerts.metservice.com/'

// The feed can hold one alert or many, so "item" is always read as a list.
const feedParser = new XMLParser({
  ignoreAttributes: true,
  parseTagValue: false,
  isArray: (tagName) => tagName === 'item',
})

interface FeedItem {
  link: string
}

interface Feed {
  rss?: { channel?: { item?: FeedItem[] } }
}

// Downloads a page as text. Stops with an error if MetService says something went wrong.
async function fetchText(
  url: string,
  fetchFunction: typeof fetch,
): Promise<string> {
  const response = await fetchFunction(url)

  if (!response.ok) {
    throw new Error(
      `MetService responded with status ${response.status} for ${url}`,
    )
  }

  return response.text()
}

// The feed is a list of alerts. Each one has a link to its full details.
function alertLinksFromFeed(feedXml: string): string[] {
  const feed = feedParser.parse(feedXml) as Feed
  const items = feed.rss?.channel?.item ?? []

  return items
    .map((item) => item.link)
    .filter((link) => link.startsWith(ALERT_LINK_START))
}

// Gets every current MetService alert and gives them back in our Warning shape.
// `fetchFunction` defaults to the real fetch. Tests pass in a fake one.
export async function fetchWarnings(
  fetchFunction: typeof fetch = fetch,
): Promise<Warning[]> {
  const feedXml = await fetchText(METSERVICE_FEED_URL, fetchFunction)
  const links = alertLinksFromFeed(feedXml)

  // Download all the alerts at the same time rather than one after another.
  const alertXmls = await Promise.all(
    links.map((link) => fetchText(link, fetchFunction)),
  )

  // Convert each one, and drop any that capToWarning says we shouldn't show.
  return alertXmls
    .map((xml) => capToWarning(xml))
    .filter((warning): warning is Warning => warning !== null)
}
