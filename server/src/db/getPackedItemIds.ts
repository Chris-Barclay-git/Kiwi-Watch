import type { Knex } from 'knex'

// Gives the ids of the go bag items this user has packed, in alphabetical order.
export async function getPackedItemIds(
  db: Knex,
  userId: number,
): Promise<string[]> {
  return db('go_bag_items')
    .where({ user_id: userId })
    .orderBy('item_id')
    .pluck('item_id')
}
