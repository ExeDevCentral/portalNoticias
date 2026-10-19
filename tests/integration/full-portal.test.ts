import { describe, it, expect } from 'vitest';
import { initTestDb } from '../db/test-db-helper';
import { NewsRepository } from '../../src/db/news-repository';
import { seedDatabase } from '../../src/scripts/seed-data';

describe('Portal Integration', () => {
  it('seeds initial Rosario news, retrieves pinned story and categorizes correctly', async () => {
    const db = initTestDb();
    const repo = new NewsRepository(db);

    await seedDatabase(repo);

    const latest = await repo.getLatestNews(20);
    expect(latest.length).toBeGreaterThan(0);

    const pinned = await repo.getPinnedNews();
    expect(pinned).not.toBeNull();

    const sports = await repo.getNewsByCategory('deportes');
    expect(sports.length).toBeGreaterThan(0);
  });
});
