import { NewsRepository } from '../db/news-repository';
import { LiveBroadcaster, liveBroadcaster } from './live/live-broadcaster';
import { runCrawlerSync, SyncResult } from './scraper/engine';
import { InsertLiveAlert, InsertNewsItem, AlertLevel } from '../db/schema';

export interface CreateAlertInput {
  title: string;
  level: AlertLevel;
  expiresAt?: Date;
}

export async function handleCreateAlert(
  data: CreateAlertInput,
  repo: NewsRepository,
  broadcaster: LiveBroadcaster = liveBroadcaster
) {
  const alert = await repo.createLiveAlert({
    title: data.title,
    level: data.level,
    active: true,
    expiresAt: data.expiresAt,
  });

  broadcaster.publish({
    type: 'alert',
    payload: {
      id: alert.id,
      title: alert.title,
      level: alert.level,
    },
  });

  return { success: true, alert };
}

export async function handlePublishNews(
  data: Omit<InsertNewsItem, 'id' | 'createdAt' | 'slug'> & { id?: string; slug?: string },
  repo: NewsRepository,
  broadcaster: LiveBroadcaster = liveBroadcaster
) {
  const news = await repo.createNewsItem(data);

  if (news) {
    broadcaster.publish({
      type: 'news_item',
      payload: {
        id: news.id,
        title: news.title,
        slug: news.slug,
        summary: news.summary,
        source: news.source,
        category: news.category,
        isUrgent: news.isUrgent,
      },
    });
  }

  return { success: !!news, news };
}

export async function handleTriggerSync(
  repo: NewsRepository,
  broadcaster: LiveBroadcaster = liveBroadcaster
): Promise<SyncResult> {
  const result = await runCrawlerSync(repo);

  if (result.totalInserted > 0) {
    broadcaster.publish({
      type: 'ping',
      payload: {
        message: `Sincronización completada: ${result.totalInserted} noticias nuevas incorporadas.`,
      },
    });
  }

  return result;
}
