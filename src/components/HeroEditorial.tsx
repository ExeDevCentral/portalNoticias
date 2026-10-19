import React from 'react';
import Link from 'next/link';
import { NewsItem } from '../db/schema';
import { formatTimeAgo } from '../utils/formatters';

interface HeroEditorialProps {
  article: NewsItem;
}

export default function HeroEditorial({ article }: HeroEditorialProps) {
  if (!article) return null;

  return (
    <article
      style={{
        borderBottom: '2px solid var(--ink)',
        paddingBottom: '24px',
        marginBottom: '28px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span className="badge-deadpan" style={{ textTransform: 'uppercase' }}>
          {article.category || 'PORTADA REGIONAL'}
        </span>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
          {article.source} • {formatTimeAgo(article.publishedAt)}
        </span>
      </div>

      <Link href={`/noticia/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)',
            lineHeight: 1.1,
            fontWeight: 800,
            margin: '8px 0 14px 0',
            color: 'var(--ink)',
          }}
        >
          {article.title}
        </h2>
      </Link>

      <p
        className="font-body"
        style={{
          fontSize: '1.2rem',
          lineHeight: 1.5,
          color: 'var(--ink-soft)',
          marginBottom: '16px',
          borderLeft: '3px solid var(--red-urgent)',
          paddingLeft: '14px',
        }}
      >
        {article.summary}
      </p>

      {article.imageUrl && (
        <div className="press-photo-container" style={{ maxHeight: '420px', marginBottom: '10px' }}>
          <img
            src={article.imageUrl}
            alt={article.title}
            className="press-photo"
            style={{ width: '100%', height: '360px', objectFit: 'cover' }}
          />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <span className="press-caption" style={{ margin: 0 }}>
          FUENTE: {article.source} • REGISTRO EN TIEMPO REAL
        </span>
        <Link
          href={`/noticia/${article.slug}`}
          className="font-mono"
          style={{
            fontSize: '0.8rem',
            color: 'var(--red-urgent)',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          LEER CRÓNICA COMPLETA ➔
        </Link>
      </div>
    </article>
  );
}
