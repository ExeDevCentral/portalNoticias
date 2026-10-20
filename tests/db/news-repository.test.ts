import { describe, it, expect, beforeEach } from 'vitest';
import { initTestDb } from './test-db-helper';
import { NewsRepository } from '../../src/db/news-repository';

describe('NewsRepository', () => {
  let repo: NewsRepository;

  beforeEach(() => {
    const db = initTestDb();
    repo = new NewsRepository(db);
  });

  it('inserts and retrieves latest news sorted by publishedAt descending', async () => {
    await repo.createNewsItem({
      title: 'Noticia Antigua',
      slug: 'noticia-antigua',
      summary: 'Resumen antiguo',
      content: '<p>Cuerpo</p>',
      imageUrl: 'https://example.com/img1.jpg',
      source: 'Rosario3',
      sourceUrl: 'https://rosario3.com/1',
      category: 'ciudad',
      isUrgent: false,
      isPinned: false,
      publishedAt: new Date('2026-10-14T10:00:00Z'),
    });

    await repo.createNewsItem({
      title: 'Noticia Reciente',
      slug: 'noticia-reciente',
      summary: 'Resumen reciente',
      content: '<p>Cuerpo</p>',
      imageUrl: 'https://example.com/img2.jpg',
      source: 'La Capital',
      sourceUrl: 'https://lacapital.com.ar/2',
      category: 'seguridad',
      isUrgent: true,
      isPinned: true,
      publishedAt: new Date('2026-10-15T12:00:00Z'),
    });

    const latest = await repo.getLatestNews(10);
    expect(latest).toHaveLength(2);
    expect(latest[0].title).toBe('Noticia Reciente');
    expect(latest[0].isUrgent).toBe(true);
  });

  it('prevents inserting duplicate news items with same sourceUrl', async () => {
    const item = {
      title: 'Noticia Duplicada',
      slug: 'noticia-duplicada',
      summary: 'Resumen',
      content: '<p>Cuerpo</p>',
      imageUrl: 'https://example.com/img.jpg',
      source: 'El Ciudadano',
      sourceUrl: 'https://elciudadanoweb.com/nota-1',
      category: 'politica' as const,
      isUrgent: false,
      isPinned: false,
      publishedAt: new Date(),
    };

    await repo.createNewsItem(item);
    const second = await repo.createNewsItem(item);
    expect(second).toBeNull(); // Deduplication returns null or skips
  });

  it('retrieves pinned news item and active alerts', async () => {
    await repo.createNewsItem({
      title: 'Nota de Portada',
      slug: 'nota-de-portada',
      summary: 'Resumen portada',
      content: '<p>Cuerpo</p>',
      imageUrl: 'https://example.com/img.jpg',
      source: 'La Capital',
      sourceUrl: 'https://lacapital.com.ar/portada',
      category: 'politica',
      isUrgent: false,
      isPinned: true,
      publishedAt: new Date(),
    });

    const pinned = await repo.getPinnedNews();
    expect(pinned).not.toBeNull();
    expect(pinned?.title).toBe('Nota de Portada');

    await repo.createLiveAlert({
      title: 'Alerta Roja: Viento fuerte en el Río Paraná',
      level: 'critical_red',
      active: true,
    });

    const alerts = await repo.getActiveAlerts();
    expect(alerts).toHaveLength(1);
    expect(alerts[0].title).toContain('Alerta Roja');
  });

  it('clears all news items completely', async () => {
    await repo.createNewsItem({
      title: 'Nota para borrar',
      slug: 'nota-para-borrar',
      summary: 'Resumen',
      content: '<p>Cuerpo</p>',
      imageUrl: 'https://example.com/img.jpg',
      source: 'La Capital',
      sourceUrl: 'https://lacapital.com.ar/borrar',
      category: 'ciudad',
      isUrgent: false,
      isPinned: false,
      publishedAt: new Date(),
    });

    let news = await repo.getLatestNews(10);
    expect(news).toHaveLength(1);

    await repo.clearAllNews();
    news = await repo.getLatestNews(10);
    expect(news).toHaveLength(0);
  });

  it('updates pinned status accurately via setPinnedNews', async () => {
    const item1 = await repo.createNewsItem({
      title: 'Nota 1',
      slug: 'nota-1',
      summary: 'Resumen 1',
      content: '<p>Cuerpo 1</p>',
      imageUrl: 'https://example.com/img1.jpg',
      source: 'La Capital',
      sourceUrl: 'https://lacapital.com.ar/nota-1',
      category: 'ciudad',
      isUrgent: false,
      isPinned: false,
      publishedAt: new Date(),
    });

    const item2 = await repo.createNewsItem({
      title: 'Nota 2',
      slug: 'nota-2',
      summary: 'Resumen 2',
      content: '<p>Cuerpo 2</p>',
      imageUrl: 'https://example.com/img2.jpg',
      source: 'Clarín',
      sourceUrl: 'https://clarin.com/nota-2',
      category: 'politica',
      isUrgent: false,
      isPinned: false,
      publishedAt: new Date(),
    });

    await repo.setPinnedNews(item2!.id);
    const pinned = await repo.getPinnedNews();
    expect(pinned?.id).toBe(item2!.id);

    await repo.setPinnedNews(item1!.id);
    const pinnedNew = await repo.getPinnedNews();
    expect(pinnedNew?.id).toBe(item1!.id);
  });
});


