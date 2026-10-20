import React from 'react';
import Link from 'next/link';
import { db } from '../../../db';
import { NewsRepository } from '../../../db/news-repository';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ShareButtons from '../../../components/ShareButtons';
import { generateArticleJsonLd } from '../../../utils/seo';
import { formatTimeAgo, formatDateSpanish } from '../../../utils/formatters';

import { DEFAULT_STORIES } from '../../../services/hero-stories';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug: rawSlug } = await params;
  const decodedSlug = decodeURIComponent(rawSlug);
  const repo = new NewsRepository(db);

  let article = await repo.getNewsBySlug(decodedSlug)
    || await repo.getNewsBySlug(rawSlug)
    || await repo.getNewsById(decodedSlug)
    || await repo.getNewsById(rawSlug);

  // Fallback to default editorial stories if not yet in database
  if (!article) {
    const defaultStory = DEFAULT_STORIES.find(
      (s) => s.slug === decodedSlug || s.slug === rawSlug || s.id === decodedSlug
    );
    if (defaultStory) {
      article = {
        id: defaultStory.id,
        title: defaultStory.title,
        slug: defaultStory.slug,
        summary: defaultStory.summary,
        content: `
          <p>${defaultStory.hook}</p>
          <p>${defaultStory.summary}</p>
          ${
            defaultStory.keyFacts && defaultStory.keyFacts.length > 0
              ? `<h3>Puntos clave del despacho</h3><ul>${defaultStory.keyFacts.map((f) => `<li>${f}</li>`).join('')}</ul>`
              : ''
          }
          <p>Cobertura editorial especial de Rosario en Tiempo Real con información contrastada y fuentes verificadas.</p>
        `,
        imageUrl: defaultStory.imageUrl,
        source: defaultStory.source,
        sourceUrl: defaultStory.sourceUrl || '',
        category: (defaultStory.category.toLowerCase().includes('seguridad')
          ? 'seguridad'
          : defaultStory.category.toLowerCase().includes('deporte') || defaultStory.category.toLowerCase().includes('clásico')
          ? 'deportes'
          : defaultStory.category.toLowerCase().includes('economia') || defaultStory.category.toLowerCase().includes('puerto')
          ? 'economia'
          : defaultStory.category.toLowerCase().includes('rio') || defaultStory.category.toLowerCase().includes('ciudad')
          ? 'ciudad'
          : 'sociedad') as any,
        isUrgent: !!defaultStory.isBreaking,
        isPinned: defaultStory.id === 'costanera-parana',
        publishedAt: new Date(),
        createdAt: new Date(),
      };
    }
  }

  if (!article) {
    return (
      <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
        <Header currentCategory="ciudad" />
        <main className="editorial-container" style={{ maxWidth: '720px', marginTop: '48px', textAlign: 'center' }}>
          <div
            style={{
              padding: '40px 24px',
              backgroundColor: 'var(--paper-elevated)',
              border: '1px solid var(--ink-faint)',
              borderRadius: '6px',
            }}
          >
            <span className="badge-deadpan" style={{ marginBottom: '16px', display: 'inline-block' }}>
              DESPACHO EN ACTUALIZACIÓN
            </span>
            <h1
              className="font-display"
              style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--ink)', marginBottom: '16px' }}
            >
              La noticia solicitada está siendo actualizada
            </h1>
            <p
              className="font-body"
              style={{ fontSize: '1.1rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: '28px' }}
            >
              El despacho correspondiente a <em>&ldquo;{decodedSlug}&rdquo;</em> ha sido archivado o reemplazado por cables de última hora de la redacción en vivo.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/"
                className="font-mono"
                style={{
                  backgroundColor: 'var(--ink)',
                  color: 'var(--paper)',
                  padding: '12px 22px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                }}
              >
                ← VOLVER A LA PORTADA EN VIVO
              </Link>
              <Link
                href="/#kiosco-mundial"
                className="font-mono"
                style={{
                  backgroundColor: 'var(--paper-soft)',
                  color: 'var(--ink)',
                  border: '1px solid var(--ink)',
                  padding: '12px 22px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                }}
              >
                🌍 VER GRAN KIOSCO DE DIARIOS
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canonicalUrl = `https://rosarioentiempreal.com.ar/noticia/${article.slug}`;
  const jsonLd = generateArticleJsonLd(article, canonicalUrl);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header currentCategory={article.category} />

      <main className="editorial-container" style={{ maxWidth: '820px', marginTop: '28px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Link
            href="/"
            className="font-mono"
            style={{ fontSize: '0.8rem', color: 'var(--red-urgent)', textDecoration: 'none', fontWeight: 700 }}
          >
            ← VOLVER A LA PORTADA
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="badge-deadpan" style={{ textTransform: 'uppercase' }}>
            {article.category}
          </span>
          <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--ink-soft)' }}>
            {formatDateSpanish(article.publishedAt)} ({formatTimeAgo(article.publishedAt)})
          </span>
        </div>

        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
            lineHeight: 1.05,
            fontWeight: 900,
            color: 'var(--ink)',
            margin: '12px 0 16px 0',
          }}
        >
          {article.title}
        </h1>

        <p
          className="font-body"
          style={{
            fontSize: '1.25rem',
            lineHeight: 1.5,
            color: 'var(--ink-soft)',
            borderLeft: '3px solid var(--red-urgent)',
            paddingLeft: '16px',
            marginBottom: '20px',
          }}
        >
          {article.summary}
        </p>

        <ShareButtons title={article.title} url={canonicalUrl} />

        {article.imageUrl && (
          <div className="press-photo-container" style={{ margin: '20px 0 10px 0' }}>
            <img
              src={article.imageUrl}
              alt={article.title}
              className="press-photo"
              style={{ width: '100%', maxHeight: '460px', objectFit: 'cover' }}
            />
            <div className="press-caption">
              REGISTRO FOTOGRÁFICO • FUENTE: {article.source}
            </div>
          </div>
        )}

        <div
          className="font-body article-content"
          style={{
            fontSize: '1.15rem',
            lineHeight: 1.8,
            color: 'var(--ink)',
            marginTop: '24px',
          }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.sourceUrl && (
          <div
            style={{
              backgroundColor: 'var(--paper-elevated)',
              border: '1px solid var(--ink-faint)',
              padding: '16px 20px',
              marginTop: '36px',
            }}
          >
            <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', marginBottom: '4px' }}>
              ATRIBUCIÓN DE FUENTE ORIGINAL:
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ink)' }}>
              Esta noticia fue reportada inicialmente por <strong>{article.source}</strong>.{' '}
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--red-urgent)', textDecoration: 'underline' }}
              >
                Ver artículo original en {article.source} ➔
              </a>
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
