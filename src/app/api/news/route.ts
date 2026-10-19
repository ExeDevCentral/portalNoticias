import { NextResponse } from 'next/server';
import { db } from '../../../db';
import { NewsRepository } from '../../../db/news-repository';
import { partitionNewsForHomepage } from '../../../utils/news-partition';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const repo = new NewsRepository(db);
    const items = await repo.getLatestNews(30);
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
