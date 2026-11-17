import knex from 'knex'
import type { Knex } from 'knex'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTables } from '../db/createTables'

// Each test gets its own empty database that lives only in memory.
let db: Knex

beforeEach(() => {
  db = knex({
    client: 'better-sqlite3',
    connection: { filename: ':memory:' },
    useNullAsDefault: true,
  })
})

afterEach(async () => {
  await db.destroy()
})

describe('createTables', () => {
  it('creates the users, questions, options and user_answers tables', async () => {
    // Arrange
    // (an empty database, made in beforeEach)

    // Act
    await createTables(db)

    // Assert
    expect(await db.schema.hasTable('users')).toBe(true)
    expect(await db.schema.hasTable('questions')).toBe(true)
    expect(await db.schema.hasTable('options')).toBe(true)
    expect(await db.schema.hasTable('user_answers')).toBe(true)
  })

  it('leaves existing data alone when it is run again', async () => {
    // Arrange
    await createTables(db)
    await db('users').insert({ auth0_id: 'auth0|abc', xp: 5 })

    // Act
    await createTables(db)

    // Assert
    const users = await db('users').select()
    expect(users).toEqual([{ id: 1, auth0_id: 'auth0|abc', xp: 5 }])
  })

  it('starts a new user on 0 XP', async () => {
    // Arrange
    await createTables(db)

    // Act
    await db('users').insert({ auth0_id: 'auth0|abc' })

    // Assert
    const user = await db('users').where({ auth0_id: 'auth0|abc' }).first()
    expect(user.xp).toBe(0)
  })

  it('does not let two users share a login id', async () => {
    // Arrange
    await createTables(db)
    await db('users').insert({ auth0_id: 'auth0|abc' })

    // Act
    const insertDuplicate = db('users').insert({ auth0_id: 'auth0|abc' })

    // Assert
    await expect(insertDuplicate).rejects.toThrow()
  })

  it('lets several users have no login id yet', async () => {
    // Arrange
    await createTables(db)

    // Act
    await db('users').insert({ auth0_id: null })
    await db('users').insert({ auth0_id: null })

    // Assert
    const users = await db('users').select()
    expect(users).toHaveLength(2)
  })
})
