import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export type NewsCategory = 'politica' | 'seguridad' | 'economia' | 'deportes' | 'sociedad' | 'ciudad';
export type AlertLevel = 'info' | 'warning' | 'critical_red';

export const newsItems = sqliteTable('news_items', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),
  imageUrl: text('image_url').notNull(),
  source: text('source').notNull(),
  sourceUrl: text('source_url').notNull().unique(),
  category: text('category').$type<NewsCategory>().notNull(),
  isUrgent: integer('is_urgent', { mode: 'boolean' }).notNull().default(false),
  isPinned: integer('is_pinned', { mode: 'boolean' }).notNull().default(false),
  publishedAt: integer('published_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const liveAlerts = sqliteTable('live_alerts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  level: text('level').$type<AlertLevel>().notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const articles = sqliteTable('articles', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  officialTitle: text('official_title').notNull(),
  satiricalTitle: text('satirical_title').notNull(),
  dek: text('dek').notNull(),
  body: text('body').notNull(),
  highlightQuote: text('highlight_quote'),
  category: text('category').notNull(),
  badge: text('badge').notNull(),
  imageUrl: text('image_url').notNull(),
  imageCaption: text('image_caption').notNull(),
  originalSourceUrl: text('original_source_url'),
  originalSourceName: text('original_source_name'),
  publishedAt: integer('published_at', { mode: 'timestamp' }).notNull(),
  status: text('status').default('published'),
});

export type NewsItem = typeof newsItems.$inferSelect;
export type InsertNewsItem = typeof newsItems.$inferInsert;
export type LiveAlert = typeof liveAlerts.$inferSelect;
export type InsertLiveAlert = typeof liveAlerts.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;
