import type { Profile } from '../types/profile'

// Asks our own server for the user's XP and level.
// The access token proves who the user is.
// `fetchFunction` defaults to the real fetch. Tests pass in a fake one.
export async function fetchProfile(
  accessToken: string,
  fetchFunction: typeof fetch = fetch,
): Promise<Profile> {
  const response = await fetchFunction('/api/quiz/profile', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  // If the server says something went wrong, stop and report it.
  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`)
  }

  return (await response.json()) as Profile
}
