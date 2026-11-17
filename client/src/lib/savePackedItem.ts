// Tells our own server that an item is now packed or unpacked.
// The server answers with the updated list of packed item ids.
// `fetchFunction` defaults to the real fetch. Tests pass in a fake one.
export async function savePackedItem(
  accessToken: string,
  itemId: string,
  packed: boolean,
  fetchFunction: typeof fetch = fetch,
): Promise<string[]> {
  const response = await fetchFunction(
    `/api/go-bag/${encodeURIComponent(itemId)}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ packed }),
    },
  )

  // If the server says something went wrong, stop and report it.
  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`)
  }

  const data = (await response.json()) as { packedIds: string[] }
  return data.packedIds
}
