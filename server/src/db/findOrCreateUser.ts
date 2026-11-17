import type { Knex } from 'knex'

// Finds the user with this login id and gives back their id.
// If they are new, a user is created for them first (starting on 0 XP).
export async function findOrCreateUser(
  db: Knex,
  auth0Id: string,
): Promise<number> {
  const existingUser = await db('users')
    .where({ auth0_id: auth0Id })
    .first('id')

  if (existingUser) {
    return existingUser.id
  }

  const [newUserId] = await db('users').insert({ auth0_id: auth0Id })
  return newUserId
}
