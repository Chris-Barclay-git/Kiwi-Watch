import { describe, it, expect } from 'vitest'
import { capToWarning } from '../lib/capToWarning'

// A real MetService alert (a yellow Heavy Rain Watch), used as test data.
// The digital signature part at the end is left out, as we don't read it.
const WATCH_XML = `<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
<identifier>2.49.0.0.554.0.severeweather.nz.20261116205009359.0</identifier>
<sender>https://www.metservice.com</sender>
<sent>2026-11-17T09:50:09+13:00</sent>
<status>Actual</status>
<msgType>Alert</msgType>
<scope>Public</scope>
<info>
<category>Met</category>
<event>rain</event>
<responseType>Monitor</responseType>
<urgency>Future</urgency>
<severity>Minor</severity>
<certainty>Possible</certainty>
<onset>2026-11-18T11:00:00+13:00</onset>
<expires>2026-11-18T23:00:00+13:00</expires>
<senderName>Meteorological Service of New Zealand Limited</senderName>
<headline>Heavy Rain Watch</headline>
<description>Periods of heavy rain, with thunderstorms and localised downpours possible. Rainfall amounts may approach warning criteria. Chance of upgrading to a Warning: Moderate.</description>
<instruction>Action: Monitor for updates.</instruction>
<web>https://metservice.com/warnings/home</web>
<parameter>
<valueName>ChanceOfUpgrade</valueName>
<value>Moderate</value>
</parameter>
<parameter>
<valueName>ColourCode</valueName>
<value>Yellow</value>
</parameter>
<parameter>
<valueName>ColourCodeHex</valueName>
<value>#FFEB18</value>
</parameter>
<area>
<areaDesc>The ranges of Bay of Plenty east of Opotiki, also Gisborne/Tairawhiti north of Ruatoria</areaDesc>
<polygon>-38.385,177.337 -38.380,177.302 -38.348,177.237 -38.302,177.190 -38.232,177.166 -38.102,177.237 -38.009,177.308 -37.963,177.355 -37.962,177.365 -37.953,177.420 -37.890,177.532 -37.823,177.568 -37.723,177.669 -37.716,177.679 -37.647,177.813 -37.640,177.848 -37.615,177.874 -37.609,177.885 -37.553,178.027 -37.547,178.088 -37.544,178.120 -37.548,178.310 -37.556,178.346 -37.618,178.415 -37.625,178.481 -37.685,178.544 -37.734,178.502 -37.747,178.454 -37.758,178.404 -37.781,178.355 -37.841,178.205 -37.889,178.106 -37.921,178.056 -38.023,177.915 -38.044,177.890 -38.097,177.827 -38.102,177.820 -38.167,177.679 -38.223,177.591 -38.375,177.420 -38.389,177.367 -38.385,177.337</polygon>
</area>
</info>
</alert>`

describe('capToWarning', () => {
  it('converts a MetService alert to our Warning shape', () => {
    // Arrange
    const xml = WATCH_XML

    // Act
    const warning = capToWarning(xml)

    // Assert
    expect(warning).toMatchObject({
      id: '2.49.0.0.554.0.severeweather.nz.20261116205009359.0',
      headline: 'Heavy Rain Watch',
      level: 'yellow',
      description:
        'Periods of heavy rain, with thunderstorms and localised downpours possible. Rainfall amounts may approach warning criteria. Chance of upgrading to a Warning: Moderate.',
      instruction: 'Action: Monitor for updates.',
      areaDescription:
        'The ranges of Bay of Plenty east of Opotiki, also Gisborne/Tairawhiti north of Ruatoria',
      onset: '2026-11-18T11:00:00+13:00',
      expires: '2026-11-18T23:00:00+13:00',
    })
  })

  it('turns the polygon text into latitude and longitude points', () => {
    // Arrange
    const xml = WATCH_XML

    // Act
    const warning = capToWarning(xml)

    // Assert
    const polygon = warning?.polygons[0]
    expect(warning?.polygons).toHaveLength(1)
    expect(polygon).toHaveLength(42)
    expect(polygon?.[0]).toEqual({ latitude: -38.385, longitude: 177.337 })
    expect(polygon?.[41]).toEqual({ latitude: -38.385, longitude: 177.337 }) // closes the shape
  })
  it('reads an orange warning', () => {
    // Arrange
    const xml = WATCH_XML.replace(
      '<value>Yellow</value>',
      '<value>Orange</value>',
    )

    // Act
    const warning = capToWarning(xml)

    // Assert
    expect(warning?.level).toBe('orange')
  })

  it('reads a red warning', () => {
    // Arrange
    const xml = WATCH_XML.replace('<value>Yellow</value>', '<value>Red</value>')

    // Act
    const warning = capToWarning(xml)

    // Assert
    expect(warning?.level).toBe('red')
  })

  it('returns null when the colour is one we do not know', () => {
    // Arrange
    const xml = WATCH_XML.replace(
      '<value>Yellow</value>',
      '<value>Purple</value>',
    )

    // Act
    const warning = capToWarning(xml)

    // Assert
    expect(warning).toBeNull()
  })

  it('returns null for a cancelled alert', () => {
    // Arrange
    const xml = WATCH_XML.replace(
      '<msgType>Alert</msgType>',
      '<msgType>Cancel</msgType>',
    )

    // Act
    const warning = capToWarning(xml)

    // Assert
    expect(warning).toBeNull()
  })

  it('returns null for an alert that is only a test', () => {
    // Arrange
    const xml = WATCH_XML.replace(
      '<status>Actual</status>',
      '<status>Test</status>',
    )

    // Act
    const warning = capToWarning(xml)

    // Assert
    expect(warning).toBeNull()
  })

  it('combines the shapes and names of every area in the alert', () => {
    // Arrange
    const secondArea =
      '<area><areaDesc>Northland</areaDesc><polygon>-35.0,173.0 -35.0,174.0 -36.0,174.0 -35.0,173.0</polygon></area>'
    const xml = WATCH_XML.replace('</info>', `${secondArea}</info>`)

    // Act
    const warning = capToWarning(xml)

    // Assert
    expect(warning?.polygons).toHaveLength(2)
    expect(warning?.areaDescription).toBe(
      'The ranges of Bay of Plenty east of Opotiki, also Gisborne/Tairawhiti north of Ruatoria; Northland',
    )
  })

  it('uses an empty instruction when the alert has none', () => {
    // Arrange
    const xml = WATCH_XML.replace(
      '<instruction>Action: Monitor for updates.</instruction>',
      '',
    )

    // Act
    const warning = capToWarning(xml)

    // Assert
    expect(warning?.instruction).toBe('')
  })
})
