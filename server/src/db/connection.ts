import { fileURLToPath } from 'node:url'
import knex from 'knex'

// The SQLite file lives in the server folder, however the server is started.
const DATABASE_FILE = fileURLToPath(
  new URL('../../kiwi-watch.sqlite3', import.meta.url),
)

// On Render, DATABASE_URL is the address of the Postgres database.
// On our own computer it isn't set, so we use the SQLite file instead.
const DATABASE_URL = process.env.DATABASE_URL

// The one database connection the server uses.
export const db = DATABASE_URL
  ? knex({ client: 'pg', connection: DATABASE_URL })
  : knex({
      client: 'better-sqlite3',
      connection: { filename: DATABASE_FILE },
      useNullAsDefault: true,
    })
