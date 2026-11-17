import type { Knex } from 'knex'

// Creates the tables the quiz needs. Safe to run every time the server starts:
// a table that already exists is left alone, with its data.
export async function createTables(db: Knex): Promise<void> {
  if (!(await db.schema.hasTable('users'))) {
    await db.schema.createTable('users', (table) => {
      table.increments('id')
      table.string('auth0_id').unique() // filled in when login is added
      table.integer('xp').notNullable().defaultTo(0)
    })
  }

  if (!(await db.schema.hasTable('questions'))) {
    await db.schema.createTable('questions', (table) => {
      table.increments('id')
      table.string('topic').notNullable() // e.g. "earthquakes"
      table.text('text').notNullable() // the question itself
      table.text('explanation').notNullable() // shown after the user answers
    })
  }

  if (!(await db.schema.hasTable('options'))) {
    await db.schema.createTable('options', (table) => {
      table.increments('id')
      table.integer('question_id').notNullable().references('questions.id')
      table.text('text').notNullable()
      // Only the server ever reads this. It is never sent to the browser.
      table.boolean('is_correct').notNullable().defaultTo(false)
    })
  }

  if (!(await db.schema.hasTable('user_answers'))) {
    await db.schema.createTable('user_answers', (table) => {
      table.increments('id')
      table.integer('user_id').notNullable().references('users.id')
      table.integer('question_id').notNullable().references('questions.id')
      table.integer('option_id').notNullable().references('options.id')
      table.boolean('is_correct').notNullable()
      table.timestamp('answered_at').notNullable().defaultTo(db.fn.now())
    })
  }
}
