// One official link on the Get ready page.
export interface EmergencyLink {
  title: string
  description: string
  url: string
}

// A heading with the links that belong under it.
export interface EmergencyLinkGroup {
  heading: string
  links: EmergencyLink[]
}
