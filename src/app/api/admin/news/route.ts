import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { NewsRepository } from '../../../../db/news-repository';
import { handlePublishNews } from '../../../../services/admin-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const repo = new NewsRepository(db);
    const news = await repo.getLatestNews(50);
    return NextResponse.json({ success: true, news });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const repo = new NewsRepository(db);
    const result = await handlePublishNews(
      {
        title: body.title,
        summary: body.summary,
        content: body.content || `<p>${body.summary}</p>`,
        imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
        source: body.source || 'Redacción Propia',
        sourceUrl: body.sourceUrl || `https://rosarioentiempreal.com.ar/noticia/${Date.now()}`,
        category: body.category || 'ciudad',
        isUrgent: body.isUrgent ?? false,
        isPinned: body.isPinned ?? false,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      },
      repo
    );
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
