import knex from 'knex'
import type { Knex } from 'knex'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTables } from '../db/createTables'
import { findOrCreateUser } from '../db/findOrCreateUser'

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

describe('findOrCreateUser', () => {
  it('creates a new user on 0 XP the first time', async () => {
    // Arrange
    const auth0Id = 'auth0|abc'

    // Act
    const userId = await findOrCreateUser(db, auth0Id)

    // Assert
    const user = await db('users').where({ id: userId }).first()
    expect(user.auth0_id).toBe('auth0|abc')
    expect(user.xp).toBe(0)
  })

  it('gives back the same user the next time', async () => {
    // Arrange
    const firstId = await findOrCreateUser(db, 'auth0|abc')

    // Act
    const secondId = await findOrCreateUser(db, 'auth0|abc')

    // Assert
    expect(secondId).toBe(firstId)
    expect(await db('users').select()).toHaveLength(1)
  })

  it('gives different people different users', async () => {
    // Arrange
    const firstId = await findOrCreateUser(db, 'auth0|abc')

    // Act
    const secondId = await findOrCreateUser(db, 'auth0|xyz')

    // Assert
    expect(secondId).not.toBe(firstId)
  })
})
