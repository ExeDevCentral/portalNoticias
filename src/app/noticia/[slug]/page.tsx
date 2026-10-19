import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '../../../db';
import { NewsRepository } from '../../../db/news-repository';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ShareButtons from '../../../components/ShareButtons';
import { generateArticleJsonLd } from '../../../utils/seo';
import { formatTimeAgo, formatDateSpanish } from '../../../utils/formatters';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const repo = new NewsRepository(db);
  const article = await repo.getNewsBySlug(slug);

  if (!article) {
    notFound();
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
