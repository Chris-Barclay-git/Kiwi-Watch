import { describe, it, expect } from 'vitest'
import { requireToken } from '../lib/requireToken'

describe('requireToken', () => {
  it('returns the token Auth0 gives us', async () => {
    // Arrange
    const getToken = async () => 'test-token'

    // Act
    const token = await requireToken(getToken)

    // Assert
    expect(token).toBe('test-token')
  })

  it('throws an error when Auth0 gives us no token', async () => {
    // Arrange
    const getToken = async () => undefined

    // Act
    const act = () => requireToken(getToken)

    // Assert
    await expect(act()).rejects.toThrow('Could not get a login token')
  })
})
