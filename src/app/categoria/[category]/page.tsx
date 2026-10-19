import React from 'react';
import Link from 'next/link';
import { db } from '../../../db';
import { NewsRepository } from '../../../db/news-repository';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { formatTimeAgo } from '../../../utils/formatters';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export const dynamic = 'force-dynamic';

const CATEGORY_TITLES: Record<string, string> = {
  politica: 'Política Santafesina',
  seguridad: 'Seguridad & Policiales',
  economia: 'Economía, Puerto & Hidrovía',
  deportes: 'Deportes: Newell’s y Rosario Central',
  sociedad: 'Sociedad, Salud & Cultura',
  ciudad: 'Ciudad & Servicios Urbanos',
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const repo = new NewsRepository(db);
  const items = await repo.getNewsByCategory(category, 30);

  const title = CATEGORY_TITLES[category] || `Sección ${category.toUpperCase()}`;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      <Header currentCategory={category} />

      <main className="editorial-container" style={{ marginTop: '28px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Link
            href="/"
            className="font-mono"
            style={{ fontSize: '0.8rem', color: 'var(--red-urgent)', textDecoration: 'none', fontWeight: 700 }}
          >
            ← VOLVER A LA PORTADA
          </Link>
        </div>

        <header style={{ borderBottom: '2px solid var(--ink)', paddingBottom: '12px', marginBottom: '28px' }}>
          <span className="badge-deadpan" style={{ textTransform: 'uppercase' }}>
            SECCIÓN EDITORIAL
          </span>
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 900,
              margin: '8px 0',
              color: 'var(--ink)',
            }}
          >
            {title}
          </h1>
          <p className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', margin: 0 }}>
            {items.length} {items.length === 1 ? 'despacho publicado' : 'despachos publicados'} en esta sección
          </p>
        </header>

        {items.length === 0 ? (
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: 'var(--paper-elevated)',
              border: '1px solid var(--ink-faint)',
            }}
          >
            <p className="font-mono" style={{ color: 'var(--ink-soft)', margin: 0 }}>
              No se registran despachos activos en esta categoría por el momento.
            </p>
            <Link
              href="/redaccion"
              className="font-mono"
              style={{
                display: 'inline-block',
                marginTop: '16px',
                color: 'var(--red-urgent)',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Ir a la Sala de Redacción para consultar cables ➔
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
            }}
          >
            {items.map((item) => (
              <article
                key={item.id}
                style={{
                  border: '1px solid var(--ink-faint)',
                  backgroundColor: 'var(--paper-elevated)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: '14px' }}
                    />
                  )}
                  <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', marginBottom: '6px' }}>
                    {item.source} • {formatTimeAgo(item.publishedAt)}
                  </div>
                  <h2 style={{ fontSize: '1.25rem', lineHeight: 1.25, margin: '6px 0 10px 0' }}>
                    <Link href={`/noticia/${item.slug}`} style={{ color: 'var(--ink)', textDecoration: 'none' }}>
                      {item.title}
                    </Link>
                  </h2>
                  <p style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', margin: 0, lineHeight: 1.5 }}>
                    {item.summary}
                  </p>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--ink-faint)' }}>
                  <Link
                    href={`/noticia/${item.slug}`}
                    className="font-mono"
                    style={{ fontSize: '0.78rem', color: 'var(--red-urgent)', fontWeight: 700, textDecoration: 'none' }}
                  >
                    LEER DESPACHO COMPLETO ➔
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
