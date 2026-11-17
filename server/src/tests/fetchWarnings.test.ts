import { describe, it, expect } from 'vitest'
import { fetchWarnings } from '../lib/fetchWarnings'

const FEED_URL = 'https://alerts.metservice.com/cap/rss'
const ALERT_URL_ONE = 'https://alerts.metservice.com/cap/alert?id=alert-one'
const ALERT_URL_TWO = 'https://alerts.metservice.com/cap/alert?id=alert-two'

// Builds a MetService-style feed that lists the given alert links.
function makeFeedXml(links: string[]): string {
  const items = links
    .map(
      (link) => `<item>
<title>Heavy Rain Watch</title>
<guid>${link}</guid>
<category>Met</category>
<description>Heavy rain.</description>
<link>${link}</link>
</item>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
<title>Metservice Public CAP Alerts</title>
<link>https://www.metservice.com</link>
${items}
</channel>
</rss>`
}

// Builds a small MetService-style alert with the given id and colour.
function makeAlertXml(id: string, colour: string, msgType = 'Alert'): string {
  return `<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
<identifier>${id}</identifier>
<sent>2026-11-17T09:50:09+13:00</sent>
<status>Actual</status>
<msgType>${msgType}</msgType>
<info>
<headline>Heavy Rain Warning</headline>
<description>Heavy rain.</description>
<instruction>Action: Be prepared.</instruction>
<onset>2026-11-18T11:00:00+13:00</onset>
<expires>2026-11-18T23:00:00+13:00</expires>
<parameter>
<valueName>ColourCode</valueName>
<value>${colour}</value>
</parameter>
<area>
<areaDesc>Northland</areaDesc>
<polygon>-35.0,173.0 -35.0,174.0 -36.0,174.0 -35.0,173.0</polygon>
</area>
</info>
</alert>`
}

// A fake fetch that answers from a list of pages, and notes every address it was asked for.
// Any address not in the list gets a 404 "not found" answer.
function makeFakeFetch(
  pages: Record<string, string>,
  requestedUrls: string[],
): typeof fetch {
  return (async (url: string) => {
    requestedUrls.push(url)
    const body = pages[url]
    return body === undefined
      ? new Response('Not found', { status: 404 })
      : new Response(body, { status: 200 })
  }) as typeof fetch
}

describe('fetchWarnings', () => {
  it('returns the warnings listed in the feed', async () => {
    // Arrange
    const requestedUrls: string[] = []
    const fakeFetch = makeFakeFetch(
      {
        [FEED_URL]: makeFeedXml([ALERT_URL_ONE]),
        [ALERT_URL_ONE]: makeAlertXml('alert-one', 'Orange'),
      },
      requestedUrls,
    )

    // Act
    const warnings = await fetchWarnings(fakeFetch)

    // Assert
    expect(warnings).toHaveLength(1)
    expect(warnings[0].id).toBe('alert-one')
    expect(warnings[0].level).toBe('orange')
  })

  it('asks for the feed first, then for each alert it lists', async () => {
    // Arrange
    const requestedUrls: string[] = []
    const fakeFetch = makeFakeFetch(
      {
        [FEED_URL]: makeFeedXml([ALERT_URL_ONE, ALERT_URL_TWO]),
        [ALERT_URL_ONE]: makeAlertXml('alert-one', 'Orange'),
        [ALERT_URL_TWO]: makeAlertXml('alert-two', 'Red'),
      },
      requestedUrls,
    )

    // Act
    await fetchWarnings(fakeFetch)

    // Assert
    expect(requestedUrls).toEqual([FEED_URL, ALERT_URL_ONE, ALERT_URL_TWO])
  })

  it('keeps the warnings in the order the feed lists them', async () => {
    // Arrange
    const requestedUrls: string[] = []
    const fakeFetch = makeFakeFetch(
      {
        [FEED_URL]: makeFeedXml([ALERT_URL_TWO, ALERT_URL_ONE]),
        [ALERT_URL_ONE]: makeAlertXml('alert-one', 'Orange'),
        [ALERT_URL_TWO]: makeAlertXml('alert-two', 'Red'),
      },
      requestedUrls,
    )

    // Act
    const warnings = await fetchWarnings(fakeFetch)

    // Assert
    expect(warnings.map((warning) => warning.id)).toEqual([
      'alert-two',
      'alert-one',
    ])
  })

  it('ignores links that are not on the MetService alerts site', async () => {
    // Arrange
    const outsideLink = 'https://example.com/not-metservice'
    const requestedUrls: string[] = []
    const fakeFetch = makeFakeFetch(
      {
        [FEED_URL]: makeFeedXml([outsideLink]),
        [outsideLink]: makeAlertXml('outside-alert', 'Red'),
      },
      requestedUrls,
    )

    // Act
    const warnings = await fetchWarnings(fakeFetch)

    // Assert
    expect(warnings).toEqual([])
    expect(requestedUrls).toEqual([FEED_URL]) // the outside link was never visited
  })

  it('drops alerts that should not be shown, such as cancellations', async () => {
    // Arrange
    const requestedUrls: string[] = []
    const fakeFetch = makeFakeFetch(
      {
        [FEED_URL]: makeFeedXml([ALERT_URL_ONE]),
        [ALERT_URL_ONE]: makeAlertXml('alert-one', 'Orange', 'Cancel'),
      },
      requestedUrls,
    )

    // Act
    const warnings = await fetchWarnings(fakeFetch)

    // Assert
    expect(warnings).toEqual([])
  })

  it('returns an empty list when the feed has no alerts', async () => {
    // Arrange
    const requestedUrls: string[] = []
    const fakeFetch = makeFakeFetch(
      { [FEED_URL]: makeFeedXml([]) },
      requestedUrls,
    )

    // Act
    const warnings = await fetchWarnings(fakeFetch)

    // Assert
    expect(warnings).toEqual([])
  })

  it('throws an error when the feed cannot be downloaded', async () => {
    // Arrange: no pages at all, so every address answers 404
    const requestedUrls: string[] = []
    const fakeFetch = makeFakeFetch({}, requestedUrls)

    // Act
    const act = () => fetchWarnings(fakeFetch)

    // Assert
    await expect(act()).rejects.toThrow('MetService responded with status 404')
  })

  it('throws an error when one of the alerts cannot be downloaded', async () => {
    // Arrange: the feed lists an alert, but that alert's page is missing
    const requestedUrls: string[] = []
    const fakeFetch = makeFakeFetch(
      { [FEED_URL]: makeFeedXml([ALERT_URL_ONE]) },
      requestedUrls,
    )

    // Act
    const act = () => fetchWarnings(fakeFetch)

    // Assert
    await expect(act()).rejects.toThrow('MetService responded with status 404')
  })
})
