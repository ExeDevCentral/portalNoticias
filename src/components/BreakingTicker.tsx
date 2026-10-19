'use client';

import React from 'react';
import Link from 'next/link';

interface BreakingItem {
  id: string;
  title: string;
  slug?: string;
  sourceUrl?: string;
}

interface BreakingTickerProps {
  items: BreakingItem[];
}

export default function BreakingTicker({ items }: BreakingTickerProps) {
  if (!items || items.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: 'var(--paper-elevated)',
        borderBottom: '1px solid var(--ink-faint)',
        padding: '6px 0',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div className="editorial-container" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px' }}>
        <div
          style={{
            backgroundColor: 'var(--red-urgent)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '2px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            letterSpacing: '0.05em',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              backgroundColor: '#FFFFFF',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'pulse 1.5s infinite',
            }}
          />
          ÚLTIMO MOMENTO
        </div>

        <div
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            scrollbarWidth: 'none',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-body)',
          }}
        >
          {items.map((item, idx) => (
            <span key={item.id || idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              {item.slug ? (
                <Link
                  href={`/noticia/${item.slug}`}
                  style={{ color: 'var(--ink)', textDecoration: 'none', fontWeight: 600 }}
                >
                  {item.title}
                </Link>
              ) : (
                <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{item.title}</span>
              )}
              {idx < items.length - 1 && <span style={{ color: 'var(--ink-faint)' }}>•</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
