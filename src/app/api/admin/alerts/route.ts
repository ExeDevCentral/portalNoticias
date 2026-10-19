import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { NewsRepository } from '../../../../db/news-repository';
import { handleCreateAlert } from '../../../../services/admin-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const repo = new NewsRepository(db);
    const alerts = await repo.getActiveAlerts();
    return NextResponse.json({ success: true, alerts });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const repo = new NewsRepository(db);
    const result = await handleCreateAlert(
      {
        title: body.title,
        level: body.level || 'info',
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
      },
      repo
    );
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
