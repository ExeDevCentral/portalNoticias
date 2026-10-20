import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { NewsRepository } from '../../../db/news-repository';
import { partitionNewsForHomepage } from '../../../utils/news-partition';
import { runCrawlerSync } from '../../../services/scraper/engine';

export const dynamic = 'force-dynamic';

let lastAutoSyncTimestamp = 0;
const SYNC_INTERVAL_MS = 15 * 60 * 1000; // 15 minutos

export async function GET() {
  try {
    const repo = new NewsRepository(db);
    let items = await repo.getLatestNews(50);

    const now = Date.now();
    const isStale = now - lastAutoSyncTimestamp > SYNC_INTERVAL_MS;

    if (items.length === 0) {
      lastAutoSyncTimestamp = now;
      await runCrawlerSync(repo);
      items = await repo.getLatestNews(50);
    } else if (isStale) {
      lastAutoSyncTimestamp = now;
      runCrawlerSync(repo).catch((err) => {
        console.error('Background auto-sync error:', err);
      });
    }

    const alerts = await repo.getActiveAlerts();
    const partitioned = partitionNewsForHomepage(items);

    return NextResponse.json({
      success: true,
      data: {
        ...partitioned,
        alerts,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
