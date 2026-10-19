import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { NewsRepository } from '../../../../db/news-repository';
import { handleTriggerSync } from '../../../../services/admin-service';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const repo = new NewsRepository(db);
    const result = await handleTriggerSync(repo);
    return NextResponse.json({ success: true, result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
