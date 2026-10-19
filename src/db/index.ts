import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import * as schema from './schema';

const DB_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'portal.db');
const sqlite = new Database(DB_PATH);

// Ensure tables exist
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

  CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    official_title TEXT NOT NULL,
    satirical_title TEXT NOT NULL,
    dek TEXT NOT NULL,
    body TEXT NOT NULL,
    highlight_quote TEXT,
    category TEXT NOT NULL,
    badge TEXT NOT NULL,
    image_url TEXT NOT NULL,
    image_caption TEXT NOT NULL,
    original_source_url TEXT,
    original_source_name TEXT,
    published_at INTEGER NOT NULL,
    status TEXT DEFAULT 'published'
  );
`);

export const db = drizzle(sqlite, { schema });
export { schema };
