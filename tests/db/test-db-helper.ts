import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../../src/db/schema';

export function initTestDb() {
  const sqlite = new Database(':memory:');
  const db = drizzle(sqlite, { schema });

  // Create tables for test db
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS news_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      image_url TEXT NOT NULL,
      source TEXT NOT NULL,
      source_url TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      is_urgent INTEGER NOT NULL DEFAULT 0,
      is_pinned INTEGER NOT NULL DEFAULT 0,
      published_at INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS live_alerts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      level TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      expires_at INTEGER,
      created_at INTEGER NOT NULL
    );
  `);

  return db;
}
