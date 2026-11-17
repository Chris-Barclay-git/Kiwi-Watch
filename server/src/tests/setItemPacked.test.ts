import knex from 'knex'
import type { Knex } from 'knex'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createTables } from '../db/createTables'
import { setItemPacked } from '../db/setItemPacked'

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

describe('setItemPacked', () => {
  it('packs an item', async () => {
    // Arrange
    await db('users').insert({ auth0_id: 'auth0|abc' })

    // Act
    await setItemPacked(db, 1, 'water', true)

    // Assert
    const rows = await db('go_bag_items').select()
    expect(rows).toEqual([{ user_id: 1, item_id: 'water' }])
  })

  it('does not pack the same item twice', async () => {
    // Arrange
    await db('users').insert({ auth0_id: 'auth0|abc' })

    // Act
    await setItemPacked(db, 1, 'water', true)
    await setItemPacked(db, 1, 'water', true)

    // Assert
    const rows = await db('go_bag_items').select()
    expect(rows).toHaveLength(1)
  })

  it('unpacks an item', async () => {
    // Arrange
    await db('users').insert({ auth0_id: 'auth0|abc' })
    await db('go_bag_items').insert({ user_id: 1, item_id: 'water' })

    // Act
    await setItemPacked(db, 1, 'water', false)

    // Assert
    const rows = await db('go_bag_items').select()
    expect(rows).toEqual([])
  })

  it('does nothing when unpacking an item that is not packed', async () => {
    // Arrange
    await db('users').insert({ auth0_id: 'auth0|abc' })

    // Act
    await setItemPacked(db, 1, 'water', false)

    // Assert
    const rows = await db('go_bag_items').select()
    expect(rows).toEqual([])
  })

  it("only changes the given user's items", async () => {
    // Arrange
    await db('users').insert([
      { auth0_id: 'auth0|one' },
      { auth0_id: 'auth0|two' },
    ])
    await db('go_bag_items').insert([
      { user_id: 1, item_id: 'water' },
      { user_id: 2, item_id: 'water' },
    ])

    // Act
    await setItemPacked(db, 1, 'water', false)

    // Assert
    const rows = await db('go_bag_items').select()
    expect(rows).toEqual([{ user_id: 2, item_id: 'water' }])
  })
})
