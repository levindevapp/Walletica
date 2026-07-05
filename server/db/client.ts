import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { mkdirSync } from 'node:fs'
import * as schema from './schema.js'

mkdirSync('./data', { recursive: true })
const sqlite = new Database(process.env.DATABASE_URL ?? './data/walletica.db')
sqlite.pragma('foreign_keys = ON')
sqlite.pragma('journal_mode = WAL')

export const db = drizzle(sqlite, { schema })
