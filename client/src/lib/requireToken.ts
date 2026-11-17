// Gets the user's login token from Auth0. If Auth0 gives us nothing, that is an error.
export async function requireToken(
  getToken: () => Promise<string | undefined>,
): Promise<string> {
  const accessToken = await getToken()
  if (!accessToken) {
    throw new Error('Could not get a login token')
  }
  return accessToken
}
