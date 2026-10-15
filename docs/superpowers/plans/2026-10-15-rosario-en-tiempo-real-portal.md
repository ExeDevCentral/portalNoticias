# Rosario en Tiempo Real Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete digital news portal and live regional aggregator "Rosario en Tiempo Real" featuring Next.js App Router, SQLite with Drizzle ORM, multi-source RSS crawler, Server-Sent Events (SSE) live feed, editorial typography and dark/light modes, and an editorial admin panel.

**Architecture:** A Next.js full-stack application backed by an embedded SQLite database managed via Drizzle ORM. An internal modular crawling engine pulls and deduplicates news from Rosario's primary media outlets (La Capital, Rosario3, El Ciudadano) on schedule. Real-time updates and breaking alerts are broadcast to client views using native HTTP Server-Sent Events (`/api/live`).

**Tech Stack:** Next.js 15 (App Router, React 19), TypeScript, SQLite (via `better-sqlite3` and `drizzle-orm`), Cheerio, RSS-Parser, Vitest, Vanilla CSS / CSS Modules with modern tokens.

**Spec:** [docs/superpowers/specs/2026-10-13-rosario-en-tiempo-real-design.md](file:///c:/Users/exeme/Desktop/RosarioEntiempoReal_Backup/docs/superpowers/specs/2026-10-13-rosario-en-tiempo-real-design.md)

## Global Constraints

- **Color Palette**: Dark background `#0B0F17`, elevated `#131B2A` and `#1C2538`; Light background `#F8F9FA`, cards `#FFFFFF`, borders `#E2E8F0`.
- **Accent Colors**: Breaking `#E63946`, Rio Paraná `#0077B6` / `#0096C7`, Financial/Weather `#F59E0B`.
- **Typography**: Editorial Serif for headlines (Fraunces / Playfair Display), Sans for body (Inter / Plus Jakarta Sans), Monospace for timestamps and tickers (JetBrains Mono).
- **Categories**: `politica`, `seguridad`, `economia`, `deportes`, `sociedad`, `ciudad`.
- **Platform**: Node.js v24+, Next.js App Router with TypeScript.
- **Zero Generic Aesthetics**: Custom editorial look, no default unstyled Bootstrap layouts, high-density journalism feel.

## Review Focus

1. **Crawler Feed Failure & Malformed RSS**: External feeds returning 404, 500, or invalid XML must be caught independently without stopping the synchronization of other sources.
2. **HTML Sanitization / XSS Prevention**: Extracted summaries and article bodies containing raw scripts, iframes, or tracking pixels must be sanitized before storing and rendering.
3. **URL Deduplication Clashes**: Concurrent or repeated crawler runs must not insert duplicate stories when canonical URLs have minor query parameter variations.
4. **SSE Client Reconnection & Stream Dropping**: Client disconnections must clean up stream listeners without leaking server memory or throwing unhandled socket write errors.
5. **Slug Generation with Spanish Accents**: Titles with accents ("Rosario Central empató en el Gigante de Arroyito") must generate clean, unique slugs (`rosario-central-empato-en-el-gigante-de-arroyito`).

---

### Task 1: Project Scaffolding, TypeScript & Testing Foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `vitest.config.ts`
- Create: `src/utils/slugify.ts`
- Test: `tests/utils/slugify.test.ts`

**Interfaces:**
- Consumes: None (root configuration)
- Produces: `slugify(text: string): string` utility function for generating clean URL slugs.

- [ ] **Step 1: Write the failing test for `slugify`**

Create `tests/utils/slugify.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { slugify } from '../../src/utils/slugify';

describe('slugify', () => {
  it('converts titles with accents and special characters into clean slugs', () => {
    const input = "¡Último Momento! Rosario Central empató 1-1 en Arroyito: los detalles";
    const expected = "ultimo-momento-rosario-central-empato-1-1-en-arroyito-los-detalles";
    expect(slugify(input)).toBe(expected);
  });

  it('handles multiple consecutive dashes and trims whitespace', () => {
    const input = "  Noticia   con   muchos    espacios  ";
    const expected = "noticia-con-muchos-espacios";
    expect(slugify(input)).toBe(expected);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/utils/slugify.test.ts`
Expected: FAIL (cannot find module or `slugify` not defined).

- [ ] **Step 3: Implement project configuration and `slugify`**

Initialize `package.json` with Next.js, React, Drizzle, Better-SQLite3, RSS-Parser, Cheerio, Vitest.
Create `src/utils/slugify.ts`:
```typescript
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/utils/slugify.test.ts`
Expected: PASS (2 tests passed).

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json next.config.mjs vitest.config.ts src/utils/slugify.ts tests/utils/slugify.test.ts
git commit -m "feat: initialize project scaffolding, typescript, and slugify utility"
```

---

### Task 2: Database Layer with SQLite & Drizzle ORM

**Files:**
- Create: `src/db/schema.ts`
- Create: `src/db/index.ts`
- Create: `src/db/news-repository.ts`
- Test: `tests/db/news-repository.test.ts`

**Interfaces:**
- Consumes: `slugify(text: string): string`
- Produces: 
  - `newsItems` and `liveAlerts` schemas.
  - `createNewsItem(item: InsertNewsItem): Promise<NewsItem>`
  - `getLatestNews(limit?: number): Promise<NewsItem[]>`
  - `getUrgentNews(): Promise<NewsItem[]>`
  - `getPinnedNews(): Promise<NewsItem | null>`
  - `createLiveAlert(alert: InsertLiveAlert): Promise<LiveAlert>`
  - `getActiveAlerts(): Promise<LiveAlert[]>`

- [ ] **Step 1: Write the failing test for `news-repository`**

Create `tests/db/news-repository.test.ts`:
```typescript
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
    expect(latest.length).toBe(2);
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
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/db/news-repository.test.ts`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement schemas and `NewsRepository`**

Define schema in `src/db/schema.ts` with SQLite tables `news_items` and `live_alerts`.
Implement `NewsRepository` in `src/db/news-repository.ts` with insert, deduplication on `sourceUrl`, and query methods.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/db/news-repository.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/db/ tests/db/
git commit -m "feat: implement sqlite database schemas and news repository"
```

---

### Task 3: RSS Feed Parser & Content Sanitizer Engine

**Files:**
- Create: `src/services/scraper/sanitizer.ts`
- Create: `src/services/scraper/category-detector.ts`
- Create: `src/services/scraper/rss-parser.ts`
- Create: `src/services/scraper/engine.ts`
- Test: `tests/services/scraper.test.ts`

**Interfaces:**
- Consumes: `NewsRepository`
- Produces:
  - `sanitizeHtml(html: string): string`
  - `detectCategory(title: string, summary: string): NewsCategory`
  - `parseFeed(xmlContent: string, sourceName: string): ParsedArticle[]`
  - `runCrawlerSync(repo: NewsRepository): Promise<SyncResult>`

- [ ] **Step 1: Write the failing test for parsing and sanitization**

Create `tests/services/scraper.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from '../../src/services/scraper/sanitizer';
import { detectCategory } from '../../src/services/scraper/category-detector';
import { parseRssFeed } from '../../src/services/scraper/rss-parser';

describe('Scraper & Sanitizer', () => {
  it('strips dangerous scripts and malicious tags from html content', () => {
    const dirty = '<p>Texto informativo <script>alert("xss")</script><iframe src="evil.com"></iframe></p>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('<iframe>');
    expect(clean).toContain('Texto informativo');
  });

  it('accurately categorizes sports news with Rosario teams', () => {
    const category = detectCategory("Newell's prepara cambios para visitar a Boca", "El DT rojinegro analiza variantes.");
    expect(category).toBe('deportes');
  });

  it('accurately categorizes security / police news', () => {
    const category = detectCategory("Operativo policial en zona sur por balacera", "Detuvieron a tres sospechosos.");
    expect(category).toBe('seguridad');
  });

  it('parses an RSS XML sample correctly into structured articles', () => {
    const sampleRss = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>Rosario Noticias</title>
        <item>
          <title>Avanza la obra en el Monumento a la Bandera</title>
          <link>https://ejemplo.com/monumento</link>
          <description>Detalles de las remodelaciones</description>
          <pubDate>Thu, 15 Oct 2026 10:00:00 GMT</pubDate>
          <enclosure url="https://ejemplo.com/monumento.jpg" type="image/jpeg"/>
        </item>
      </channel>
    </rss>`;

    const parsed = parseRssFeed(sampleRss, 'Rosario Media');
    expect(parsed.length).toBe(1);
    expect(parsed[0].title).toBe('Avanza la obra en el Monumento a la Bandera');
    expect(parsed[0].imageUrl).toBe('https://ejemplo.com/monumento.jpg');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/services/scraper.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement sanitizer, category detector, and rss-parser**

Build `sanitizeHtml` using Cheerio or regex-safe whitelist.
Build keyword matcher in `detectCategory` for Rosario local context (seguridad, deportes, política, economía/puerto, sociedad, ciudad).
Build `parseRssFeed` with proper extraction of enclosure/media:content images and publication dates.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/services/scraper.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/services/scraper/ tests/services/
git commit -m "feat: implement news scraper, rss parser, and html sanitizer"
```

---

### Task 4: Real-time Server-Sent Events (SSE) Engine

**Files:**
- Create: `src/services/live/live-broadcaster.ts`
- Create: `src/app/api/live/route.ts`
- Test: `tests/services/live-broadcaster.test.ts`

**Interfaces:**
- Consumes: None
- Produces:
  - `broadcaster.subscribe(listener: (data: LiveEvent) => void): () => void`
  - `broadcaster.publish(event: LiveEvent): void`
  - `GET /api/live`: HTTP endpoint returning `text/event-stream`.

- [ ] **Step 1: Write the failing test for LiveBroadcaster**

Create `tests/services/live-broadcaster.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { LiveBroadcaster } from '../../src/services/live/live-broadcaster';

describe('LiveBroadcaster', () => {
  it('notifies registered subscribers when a new live event is published', () => {
    const broadcaster = new LiveBroadcaster();
    const received: any[] = [];

    const unsubscribe = broadcaster.subscribe((event) => {
      received.push(event);
    });

    broadcaster.publish({
      type: 'news_item',
      payload: { id: '1', title: 'Último momento en Rosario' }
    });

    expect(received.length).toBe(1);
    expect(received[0].payload.title).toBe('Último momento en Rosario');

    unsubscribe();
    broadcaster.publish({
      type: 'alert',
      payload: { id: '2', title: 'Alerta de tránsito' }
    });

    expect(received.length).toBe(1); // No new events after unsubscribe
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/services/live-broadcaster.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement LiveBroadcaster and Next.js SSE Route**

Create `src/services/live/live-broadcaster.ts` with singleton instance and clean listener tracking.
Implement `src/app/api/live/route.ts` returning `ReadableStream` with headers:
```typescript
headers: {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
  'Connection': 'keep-alive',
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/services/live-broadcaster.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/services/live/ src/app/api/live/ tests/services/live-broadcaster.test.ts
git commit -m "feat: implement real-time live event broadcaster and sse route"
```

---

### Task 5: Design System, Layout & Service Tickers

**Files:**
- Create: `src/app/globals.css`
- Create: `src/components/Header.tsx`
- Create: `src/components/ServiceTicker.tsx`
- Create: `src/components/BreakingTicker.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/app/layout.tsx`
- Test: `tests/components/ServiceTicker.test.ts`

**Interfaces:**
- Consumes: Design tokens (colors, fonts, sizes).
- Produces: Global layout with responsive header, dark/light theme persistence, service indicators (clima, dólar, puentes), and breaking marquee.

- [ ] **Step 1: Write test for service ticker data formatting**

Create `tests/components/ServiceTicker.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { formatServiceData } from '../../src/utils/formatters';

describe('formatServiceData', () => {
  it('formats weather, river height, and dollar exchange rates cleanly', () => {
    const formatted = formatServiceData({
      temp: 22,
      weatherDesc: 'Soleado',
      dolarBlue: 1250,
      paranaLevel: '2.45m',
      puenteRosarioVictoria: 'Normal'
    });

    expect(formatted).toContain('22°C Soleado');
    expect(formatted).toContain('Dólar Blue: $1250');
    expect(formatted).toContain('Río Paraná: 2.45m');
    expect(formatted).toContain('Pte. Rosario-Victoria: Normal');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/ServiceTicker.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement formatters, CSS design system, and Header components**

Add editorial tokens in `src/app/globals.css` (`--bg-primary: #0B0F17`, `--accent-breaking: #E63946`, `--accent-parana: #0077B6`, etc.).
Implement `ServiceTicker.tsx` and `BreakingTicker.tsx` with animated marquees.
Implement `Header.tsx` with Rosario en Tiempo Real branding and theme switcher.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/components/ServiceTicker.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/components/ src/utils/formatters.ts tests/components/
git commit -m "feat: implement editorial design system, service ticker, and header"
```

---

### Task 6: Homepage Grid & Real-time Live Feed Wire

**Files:**
- Create: `src/components/HeroEditorial.tsx`
- Create: `src/components/LiveFeedWire.tsx`
- Create: `src/components/CategoryBlock.tsx`
- Create: `src/app/page.tsx`
- Test: `tests/components/feed-sorting.test.ts`

**Interfaces:**
- Consumes: `NewsRepository`, SSE `/api/live` client hook.
- Produces: 12-column interactive editorial homepage.

- [ ] **Step 1: Write unit test for news partitioning and sorting**

Create `tests/components/feed-sorting.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { partitionNewsForHomepage } from '../../src/utils/news-partition';

describe('partitionNewsForHomepage', () => {
  it('isolates pinned hero article, urgent ticker items, and thematic blocks', () => {
    const mockItems = [
      { id: '1', title: 'Nota Pinned', isPinned: true, isUrgent: false, category: 'politica', publishedAt: new Date() },
      { id: '2', title: 'Nota Urgente', isPinned: false, isUrgent: true, category: 'seguridad', publishedAt: new Date() },
      { id: '3', title: 'Clásico Rosarino', isPinned: false, isUrgent: false, category: 'deportes', publishedAt: new Date() },
      { id: '4', title: 'Puerto y Granos', isPinned: false, isUrgent: false, category: 'economia', publishedAt: new Date() },
    ] as any;

    const result = partitionNewsForHomepage(mockItems);
    expect(result.hero?.title).toBe('Nota Pinned');
    expect(result.urgent.length).toBe(1);
    expect(result.byCategory.deportes.length).toBe(1);
    expect(result.byCategory.economia.length).toBe(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/components/feed-sorting.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement partition helper and homepage components**

Create `src/utils/news-partition.ts`.
Create `src/components/HeroEditorial.tsx` (7-col headline presentation with high-res imagery, source badge, reading time).
Create `src/components/LiveFeedWire.tsx` (5-col client component consuming `/api/live` SSE with entry pulse animations).
Create `src/components/CategoryBlock.tsx` for Newell's / Central, Seguridad, and Puerto.
Wire them into `src/app/page.tsx`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/components/feed-sorting.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroEditorial.tsx src/components/LiveFeedWire.tsx src/components/CategoryBlock.tsx src/app/page.tsx src/utils/news-partition.ts tests/components/feed-sorting.test.ts
git commit -m "feat: implement 12-column editorial homepage grid and real-time live feed wire"
```

---

### Task 7: Article Detail View & Category Feeds

**Files:**
- Create: `src/app/noticia/[slug]/page.tsx`
- Create: `src/app/categoria/[category]/page.tsx`
- Create: `src/components/ShareButtons.tsx`
- Test: `tests/utils/seo-metadata.test.ts`

**Interfaces:**
- Consumes: `NewsRepository.getBySlug`, `NewsRepository.getByCategory`.
- Produces: SEO-optimized reading pages with canonical link to source and OpenGraph tags.

- [ ] **Step 1: Write test for SEO Schema.org article generator**

Create `tests/utils/seo-metadata.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { generateArticleJsonLd } from '../../src/utils/seo';

describe('generateArticleJsonLd', () => {
  it('generates valid Schema.org NewsArticle JSON-LD structured data', () => {
    const article = {
      title: 'Monumento a la Bandera luce renovado',
      summary: 'Finalizaron las obras clave.',
      imageUrl: 'https://example.com/monumento.jpg',
      publishedAt: new Date('2026-10-15T12:00:00Z'),
      source: 'La Capital',
      sourceUrl: 'https://lacapital.com.ar/nota',
    } as any;

    const jsonLd = generateArticleJsonLd(article, 'https://rosarioentiempreal.com.ar/noticia/monumento');
    expect(jsonLd['@type']).toBe('NewsArticle');
    expect(jsonLd.headline).toBe(article.title);
    expect(jsonLd.image).toEqual([article.imageUrl]);
    expect(jsonLd.publisher.name).toBe('Rosario en Tiempo Real');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/utils/seo-metadata.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement SEO helper and article/category pages**

Create `src/utils/seo.ts`.
Create `src/app/noticia/[slug]/page.tsx` with full article presentation, canonical source attribution badge, and JSON-LD script tag.
Create `src/app/categoria/[category]/page.tsx` with category-filtered stream.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/utils/seo-metadata.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/noticia/ src/app/categoria/ src/components/ShareButtons.tsx src/utils/seo.ts tests/utils/seo-metadata.test.ts
git commit -m "feat: implement article detail view, category pages, and news article schema"
```

---

### Task 8: Editorial Admin Panel & Management APIs

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/app/api/admin/news/route.ts`
- Create: `src/app/api/admin/alerts/route.ts`
- Create: `src/app/api/admin/sync/route.ts`
- Test: `tests/api/admin-api.test.ts`

**Interfaces:**
- Consumes: `NewsRepository`, `LiveBroadcaster`, `runCrawlerSync`.
- Produces: Secured endpoints to publish Red Alerts, pin news, and trigger manual crawler synchronization.

- [ ] **Step 1: Write test for admin alert creation and broadcasting**

Create `tests/api/admin-api.test.ts`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { handleCreateAlert } from '../../src/services/admin-service';

describe('AdminService', () => {
  it('creates an alert and publishes to the real-time broadcaster', async () => {
    const mockRepo = { createLiveAlert: vi.fn().mockResolvedValue({ id: 'a1', title: 'Alerta Roja', level: 'critical_red' }) };
    const mockBroadcaster = { publish: vi.fn() };

    const result = await handleCreateAlert(
      { title: 'Corte total en Av. Circunvalación', level: 'critical_red' },
      mockRepo as any,
      mockBroadcaster as any
    );

    expect(result.success).toBe(true);
    expect(mockRepo.createLiveAlert).toHaveBeenCalled();
    expect(mockBroadcaster.publish).toHaveBeenCalledWith(expect.objectContaining({
      type: 'alert',
      payload: expect.objectContaining({ title: 'Corte total en Av. Circunvalación' })
    }));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/api/admin-api.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement admin service, APIs, and dashboard UI**

Create `src/services/admin-service.ts`.
Create `src/app/api/admin/alerts/route.ts`, `src/app/api/admin/news/route.ts`, and `src/app/api/admin/sync/route.ts`.
Create `src/app/admin/page.tsx` providing an intuitive control room to issue red alerts, trigger sync, and toggle pinned stories.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/api/admin-api.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/admin/ src/app/api/admin/ src/services/admin-service.ts tests/api/admin-api.test.ts
git commit -m "feat: implement editorial admin dashboard and management api endpoints"
```

---

### Task 9: Database Seeding, Build Verification & Integration Test

**Files:**
- Create: `src/scripts/seed.ts`
- Modify: `package.json` (add `db:seed`, `test`, `build` scripts)
- Test: `tests/integration/full-portal.test.ts`

**Interfaces:**
- Consumes: All prior modules.
- Produces: Production build and initialized database with realistic Rosario news content.

- [ ] **Step 1: Write integration test covering end-to-end portal lifecycle**

Create `tests/integration/full-portal.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/integration/full-portal.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement seed data and verify production build**

Create `src/scripts/seed-data.ts` and `src/scripts/seed.ts` with authentic Rosario news (Newell's, Rosario Central, Monumento a la Bandera, Puerto de Rosario, Clima, Alertas).
Run `npm run build` to verify there are zero TypeScript or bundling issues.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/integration/full-portal.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit and push**

```bash
git add src/scripts/ tests/integration/ package.json
git commit -m "feat: add database seeding, integration tests, and build verification"
git push origin main
```
