import type { Knex } from 'knex'

// Packs or unpacks one go bag item for a user.
// Packing an item that is already packed, or unpacking one that isn't, changes nothing.
export async function setItemPacked(
  db: Knex,
  userId: number,
  itemId: string,
  packed: boolean,
): Promise<void> {
  if (packed) {
    await db('go_bag_items')
      .insert({ user_id: userId, item_id: itemId })
      .onConflict(['user_id', 'item_id'])
      .ignore()
    return
  }

  await db('go_bag_items').where({ user_id: userId, item_id: itemId }).delete()
}
