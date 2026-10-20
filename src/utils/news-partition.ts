import { NewsItem, NewsCategory } from '../db/schema';

export interface PartitionedNews {
  hero: NewsItem | null;
  urgent: NewsItem[];
  byCategory: Record<NewsCategory, NewsItem[]>;
  feed: NewsItem[];
}

export function partitionNewsForHomepage(items: NewsItem[]): PartitionedNews {
  const urgent: NewsItem[] = [];
  const byCategory: Record<NewsCategory, NewsItem[]> = {
    politica: [],
    seguridad: [],
    economia: [],
    deportes: [],
    sociedad: [],
    ciudad: [],
  };

  let hero: NewsItem | null = null;
  const remaining: NewsItem[] = [];

  for (const item of items) {
    if (item.isPinned && !hero) {
      hero = item;
    } else {
      remaining.push(item);
    }

    if (item.isUrgent) {
      urgent.push(item);
    }

    if (item.category && byCategory[item.category]) {
      byCategory[item.category].push(item);
    }
  }

  // If no pinned hero was found, pick the first non-urgent or simply first item
  if (!hero && items.length > 0) {
    hero = items[0];
  }

  const effectiveUrgent = urgent.length > 0 ? urgent : items.slice(0, 5);

  return {
    hero,
    urgent: effectiveUrgent,
    byCategory,
    feed: remaining,
  };
}
