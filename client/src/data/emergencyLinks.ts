import type { EmergencyLinkGroup } from '../types/emergencyLink'

// Official places to get ready and stay informed. The order here is the order on the page.
export const EMERGENCY_LINK_GROUPS: EmergencyLinkGroup[] = [
  {
    heading: 'Get ready',
    links: [
      {
        title: 'Make a household plan',
        description:
          "Work out what your household will do, and where you'll meet.",
        url: 'https://getready.govt.nz/prepared/household/make-a-plan',
      },
      {
        title: 'Get Ready (NZ Civil Defence)',
        description:
          'Official advice for getting ready for any kind of emergency.',
        url: 'https://getready.govt.nz/',
      },
    ],
  },
  {
    heading: 'Stay informed',
    links: [
      {
        title: 'Emergency Mobile Alert',
        description: 'How the alerts on your phone work, and what to expect.',
        url: 'https://getready.govt.nz/prepared/ema',
      },
      {
        title: 'Stay informed in an emergency',
        description: 'Where to get official updates when something happens.',
        url: 'https://getready.govt.nz/prepared/stay-informed',
      },
    ],
  },
  {
    heading: 'Live updates',
    links: [
      {
        title: 'GeoNet',
        description: 'Latest quakes, volcanoes and tsunami information.',
        url: 'https://www.geonet.org.nz/',
      },
      {
        title: 'MetService warnings',
        description: 'Current weather watches and warnings.',
        url: 'https://www.metservice.com/warnings/home',
      },
      {
        title: 'National Emergency Management Agency',
        description: 'Civil Defence news, alerts and guidance.',
        url: 'https://www.civildefence.govt.nz/',
      },
    ],
  },
]
