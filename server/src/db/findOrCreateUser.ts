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

  // A new user. Two requests can arrive at the same moment for the same new user
  // (the quiz page asks for a question and a profile together). "ignore" means the
  // second one is skipped instead of failing, and we read the user back either way.
  await db('users')
    .insert({ auth0_id: auth0Id })
    .onConflict('auth0_id')
    .ignore()

  const newUser = await db('users').where({ auth0_id: auth0Id }).first('id')
  if (!newUser) {
    throw new Error('Could not create the user')
  }
  return newUser.id
}
