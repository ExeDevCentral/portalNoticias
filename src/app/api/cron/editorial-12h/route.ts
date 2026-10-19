import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { NewsRepository } from '../../../../db/news-repository';
import { liveBroadcaster } from '../../../../services/live/live-broadcaster';
import { publishRosarinoEdition } from '../../../../services/ai-editor/rosarino-bot';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const repo = new NewsRepository(db);
    const result = await publishRosarinoEdition(repo, liveBroadcaster);

    return NextResponse.json({
      success: true,
      cycle: '12h_editorial_autonomous',
      count: result.count,
      published: result.titles,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    let message = 'Unknown editorial error';
    if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === 'string') {
      message = err;
    }
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
