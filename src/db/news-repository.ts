import { eq, desc } from 'drizzle-orm';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { nanoid } from 'nanoid';
import * as schema from './schema';
import {
  newsItems,
  liveAlerts,
  articles,
  NewsItem,
  InsertNewsItem,
  LiveAlert,
  InsertLiveAlert,
  Article,
  InsertArticle,
  NewsCategory,
} from './schema';
import { slugify } from '../utils/slugify';

export class NewsRepository {
  constructor(private readonly db: BetterSQLite3Database<typeof schema>) {}

  async createNewsItem(
    item: Omit<InsertNewsItem, 'id' | 'createdAt' | 'slug'> & { id?: string; slug?: string; createdAt?: Date }
  ): Promise<NewsItem | null> {
    // Check duplicate by sourceUrl
    const existing = this.db
      .select()
      .from(newsItems)
      .where(eq(newsItems.sourceUrl, item.sourceUrl))
      .get();

    if (existing) {
      return null;
    }

    const id = item.id || nanoid();
    const slug = item.slug || slugify(item.title);
    const createdAt = item.createdAt || new Date();
    const publishedAt = item.publishedAt instanceof Date ? item.publishedAt : new Date(item.publishedAt);

    const newItem: InsertNewsItem = {
      ...item,
      id,
      slug,
      publishedAt,
      createdAt,
      isUrgent: item.isUrgent ?? false,
      isPinned: item.isPinned ?? false,
    };

    this.db.insert(newsItems).values(newItem).run();

    return this.db.select().from(newsItems).where(eq(newsItems.id, id)).get() || null;
  }

  async getLatestNews(limit = 20): Promise<NewsItem[]> {
    return this.db
      .select()
      .from(newsItems)
      .orderBy(desc(newsItems.publishedAt))
      .limit(limit)
      .all();
  }

  async getUrgentNews(): Promise<NewsItem[]> {
    return this.db
      .select()
      .from(newsItems)
      .where(eq(newsItems.isUrgent, true))
      .orderBy(desc(newsItems.publishedAt))
      .all();
  }

  async getPinnedNews(): Promise<NewsItem | null> {
    const item = this.db
      .select()
      .from(newsItems)
      .where(eq(newsItems.isPinned, true))
      .orderBy(desc(newsItems.publishedAt))
      .get();
    return item || null;
  }

  async getNewsByCategory(category: string, limit = 20): Promise<NewsItem[]> {
    return this.db
      .select()
      .from(newsItems)
      .where(eq(newsItems.category, category as NewsCategory))
      .orderBy(desc(newsItems.publishedAt))
      .limit(limit)
      .all();
  }

  async getNewsBySlug(slug: string): Promise<NewsItem | null> {
    const item = this.db
      .select()
      .from(newsItems)
      .where(eq(newsItems.slug, slug))
      .get();
    return item || null;
  }

  async getNewsById(id: string): Promise<NewsItem | null> {
    const item = this.db
      .select()
      .from(newsItems)
      .where(eq(newsItems.id, id))
      .get();
    return item || null;
  }

  async clearAllNews(): Promise<void> {
    this.db.delete(newsItems).run();
  }

  async setPinnedNews(id: string): Promise<void> {
    this.db.update(newsItems).set({ isPinned: false }).run();
    this.db.update(newsItems).set({ isPinned: true }).where(eq(newsItems.id, id)).run();
  }



  async createLiveAlert(
    alert: Omit<InsertLiveAlert, 'id' | 'createdAt'> & { id?: string; createdAt?: Date }
  ): Promise<LiveAlert> {
    const id = alert.id || nanoid();
    const createdAt = alert.createdAt || new Date();

    const newAlert: InsertLiveAlert = {
      ...alert,
      id,
      createdAt,
      active: alert.active ?? true,
    };

    this.db.insert(liveAlerts).values(newAlert).run();
    return this.db.select().from(liveAlerts).where(eq(liveAlerts.id, id)).get()!;
  }

  async getActiveAlerts(): Promise<LiveAlert[]> {
    return this.db
      .select()
      .from(liveAlerts)
      .where(eq(liveAlerts.active, true))
      .orderBy(desc(liveAlerts.createdAt))
      .all();
  }

  async createArticle(
    article: Omit<InsertArticle, 'id'> & { id?: string }
  ): Promise<Article> {
    const id = article.id || nanoid();
    const newArticle: InsertArticle = {
      ...article,
      id,
      publishedAt: article.publishedAt instanceof Date ? article.publishedAt : new Date(article.publishedAt),
    };
    this.db.insert(articles).values(newArticle).run();
    return this.db.select().from(articles).where(eq(articles.id, id)).get()!;
  }

  async getArticles(limit = 10): Promise<Article[]> {
    return this.db
      .select()
      .from(articles)
      .orderBy(desc(articles.publishedAt))
      .limit(limit)
      .all();
  }
}
