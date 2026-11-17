import knex from 'knex'
import type { Knex } from 'knex'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTables } from '../db/createTables'
import { getProfile } from '../db/getProfile'
import { XP_PER_LEVEL } from '../lib/levelForXp'

// Each test gets its own database that lives only in memory, with the tables ready.
let db: Knex

beforeEach(async () => {
  db = knex({
    client: 'better-sqlite3',
    connection: { filename: ':memory:' },
    useNullAsDefault: true,
  })
  await createTables(db)
})

afterEach(async () => {
  await db.destroy()
})

describe('getProfile', () => {
  it('gives null when there is no such user', async () => {
    // Arrange
    const missingUserId = 99

    // Act
    const profile = await getProfile(db, missingUserId)

    // Assert
    expect(profile).toBeNull()
  })

  it('gives a new user level 1 and no XP', async () => {
    // Arrange
    await db('users').insert({ auth0_id: 'auth0|new' })

    // Act
    const profile = await getProfile(db, 1)

    // Assert
    expect(profile).toEqual({
      xp: 0,
      level: 1,
      xpIntoLevel: 0,
      xpPerLevel: XP_PER_LEVEL,
    })
  })

  it("shows the user's XP and the level it gives", async () => {
    // Arrange
    const xp = XP_PER_LEVEL * 2 + 5
    await db('users').insert({ auth0_id: 'auth0|keen', xp })

    // Act
    const profile = await getProfile(db, 1)

    // Assert
    expect(profile).toEqual({
      xp,
      level: 3,
      xpIntoLevel: 5,
      xpPerLevel: XP_PER_LEVEL,
    })
  })
})
