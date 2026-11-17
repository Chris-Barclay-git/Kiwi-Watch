// Asks our own server which go bag items the user has packed.
// The access token proves who the user is.
// `fetchFunction` defaults to the real fetch. Tests pass in a fake one.
export async function fetchPackedItemIds(
  accessToken: string,
  fetchFunction: typeof fetch = fetch,
): Promise<string[]> {
  const response = await fetchFunction('/api/go-bag', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  // If the server says something went wrong, stop and report it.
  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`)
  }

  const data = (await response.json()) as { packedIds: string[] }
  return data.packedIds
}
