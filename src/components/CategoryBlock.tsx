import React from 'react';
import Link from 'next/link';
import { NewsItem } from '../db/schema';
import { formatTimeAgo } from '../utils/formatters';

interface CategoryBlockProps {
  title: string;
  categoryKey: string;
  items: NewsItem[];
}

export default function CategoryBlock({ title, categoryKey, items }: CategoryBlockProps) {
  if (!items || items.length === 0) return null;

  const [lead, ...others] = items;

  return (
    <section style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3
          className="font-display"
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            margin: 0,
            color: 'var(--ink)',
            borderBottom: '2px solid var(--red-urgent)',
            paddingBottom: '4px',
          }}
        >
          {title}
        </h3>
        <Link
          href={`/categoria/${categoryKey}`}
          className="font-mono"
          style={{ fontSize: '0.75rem', color: 'var(--red-urgent)', textDecoration: 'none', fontWeight: 600 }}
        >
          VER MÁS ➔
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Lead card */}
        {lead && (
          <div style={{ border: '1px solid var(--ink-faint)', backgroundColor: 'var(--paper-elevated)', padding: '16px' }}>
            {lead.imageUrl && (
              <img
                src={lead.imageUrl}
                alt={lead.title}
                style={{ width: '100%', height: '180px', objectFit: 'cover', marginBottom: '10px' }}
              />
            )}
            <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)', marginBottom: '4px' }}>
              {lead.source} • {formatTimeAgo(lead.publishedAt)}
            </div>
            <h4 style={{ fontSize: '1.15rem', lineHeight: 1.25, margin: '6px 0 8px 0' }}>
              <Link href={`/noticia/${lead.slug}`} style={{ color: 'var(--ink)', textDecoration: 'none' }}>
                {lead.title}
              </Link>
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', margin: 0, lineHeight: 1.4 }}>
              {lead.summary.slice(0, 160)}...
            </p>
          </div>
        )}

        {/* Other articles list */}
        {others.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {others.slice(0, 3).map((item) => (
              <div
                key={item.id}
                style={{
                  borderBottom: '1px solid var(--ink-faint)',
                  paddingBottom: '12px',
                }}
              >
                <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--ink-soft)', marginBottom: '2px' }}>
                  {item.source} • {formatTimeAgo(item.publishedAt)}
                </div>
                <h5 style={{ fontSize: '1rem', lineHeight: 1.25, margin: '2px 0' }}>
                  <Link href={`/noticia/${item.slug}`} style={{ color: 'var(--ink)', textDecoration: 'none' }}>
                    {item.title}
                  </Link>
                </h5>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
