import knex from 'knex'
import type { Knex } from 'knex'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTables } from '../db/createTables'
import { getPackedItemIds } from '../db/getPackedItemIds'

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

describe('getPackedItemIds', () => {
  it('gives an empty list for a user who has packed nothing', async () => {
    // Arrange
    await db('users').insert({ auth0_id: 'auth0|new' })

    // Act
    const packedIds = await getPackedItemIds(db, 1)

    // Assert
    expect(packedIds).toEqual([])
  })

  it('gives the ids of the items the user packed, in alphabetical order', async () => {
    // Arrange
    await db('users').insert({ auth0_id: 'auth0|keen' })
    await db('go_bag_items').insert([
      { user_id: 1, item_id: 'water' },
      { user_id: 1, item_id: 'cash' },
      { user_id: 1, item_id: 'torch' },
    ])

    // Act
    const packedIds = await getPackedItemIds(db, 1)

    // Assert
    expect(packedIds).toEqual(['cash', 'torch', 'water'])
  })

  it('leaves out items packed by other users', async () => {
    // Arrange
    await db('users').insert([
      { auth0_id: 'auth0|one' },
      { auth0_id: 'auth0|two' },
    ])
    await db('go_bag_items').insert([
      { user_id: 1, item_id: 'water' },
      { user_id: 2, item_id: 'torch' },
    ])

    // Act
    const packedIds = await getPackedItemIds(db, 1)

    // Assert
    expect(packedIds).toEqual(['water'])
  })
})
