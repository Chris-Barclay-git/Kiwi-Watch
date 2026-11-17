import type { Knex } from 'knex'
import { levelForXp } from '../lib/levelForXp'
import type { Profile } from '../types/profile'

// Reads a user's XP and works out their level. Gives null if there is no such user.
export async function getProfile(
  db: Knex,
  userId: number,
): Promise<Profile | null> {
  const user = await db('users').where({ id: userId }).first('xp')
  if (!user) {
    return null
  }

  return { xp: user.xp, ...levelForXp(user.xp) }
}
