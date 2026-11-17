import { fileURLToPath } from 'node:url'
import knex from 'knex'

// The database file lives in the server folder, however the server is started.
const DATABASE_FILE = fileURLToPath(
  new URL('../../kiwi-watch.sqlite3', import.meta.url),
)

// The one database connection the server uses.
export const db = knex({
  client: 'better-sqlite3',
  connection: { filename: DATABASE_FILE },
  useNullAsDefault: true,
})
