'use client';

import React from 'react';
import Link from 'next/link';
import { NewsItem } from '../db/schema';
import ModernNewsCard from './ModernNewsCard';
import { IconArrowRight } from './Icons';

interface CategoryBlockProps {
  title: string;
  categoryKey: string;
  items: NewsItem[];
  icon?: string;
}

export default function CategoryBlock({ title, categoryKey, items, icon }: CategoryBlockProps) {
  if (!items || items.length === 0) return null;

  const displayItems = items.slice(0, 4);

  return (
    <section style={{ marginBottom: '28px' }}>
      {/* Cabecera de Categoría Compacta */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          borderBottom: '1px solid var(--ink-faint)',
          paddingBottom: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon && <span style={{ fontSize: '1.1rem' }}>{icon}</span>}
          <h3
            className="font-display"
            style={{
              fontSize: '1.18rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              margin: 0,
              color: 'var(--ink)',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
          <span
            className="font-mono"
            style={{
              fontSize: '0.66rem',
              backgroundColor: 'var(--paper-card)',
              color: 'var(--ink-soft)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid var(--ink-faint)',
            }}
          >
            {items.length} notas
          </span>
        </div>

        <Link
          href={`/categoria/${categoryKey}`}
          className="font-mono"
          style={{
            fontSize: '0.72rem',
            color: 'var(--blue-parana)',
            textDecoration: 'none',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>VER SECCIÓN</span>
          <IconArrowRight size={10} />
        </Link>
      </div>

      {/* Cuadrícula de Tarjetas Modernas (2 columnas compactas) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '12px',
        }}
      >
        {displayItems.map((item) => (
          <ModernNewsCard
            key={item.id}
            item={item}
            variant="compact"
            showCategory={false}
          />
        ))}
      </div>
    </section>
  );
}
