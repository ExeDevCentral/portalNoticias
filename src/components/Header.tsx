'use client';

import React from 'react';
import Link from 'next/link';
import { formatDateSpanish } from '../utils/formatters';

interface HeaderProps {
  readonly currentCategory?: string;
}

const CATEGORIES = [
  { key: 'politica', label: 'Política' },
  { key: 'seguridad', label: 'Seguridad' },
  { key: 'economia', label: 'Economía & Puerto' },
  { key: 'deportes', label: "Newell's / Central" },
  { key: 'sociedad', label: 'Sociedad' },
  { key: 'ciudad', label: 'Ciudad' },
];

export default function Header({ currentCategory }: HeaderProps) {
  const todayStr = formatDateSpanish(new Date());

  return (
    <header style={{ textAlign: 'center', padding: '24px 0 12px 0' }}>
      <div className="editorial-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--red-urgent)',
              border: '1px solid var(--red-urgent)',
              padding: '2px 8px',
              borderRadius: '2px',
              letterSpacing: '0.1em',
            }}
          >
            PORTAL REGIONAL 24HS
          </span>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', letterSpacing: '0.1em' }}>
            {todayStr}
          </span>
          <Link
            href="/admin"
            className="font-mono"
            style={{
              fontSize: '0.72rem',
              color: 'var(--ink-soft)',
              textDecoration: 'none',
              border: '1px solid var(--ink-faint)',
              padding: '2px 8px',
              borderRadius: '2px',
            }}
          >
            PANEL EDITORIAL
          </Link>
        </div>

        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 6.5vw, 5.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              lineHeight: 0.95,
              textTransform: 'uppercase',
              margin: '8px 0',
              color: 'var(--ink)',
            }}
          >
            Rosario En Tiempo Real
          </h1>
        </Link>

        <p
          className="font-body"
          style={{
            fontSize: '1.15rem',
            fontStyle: 'italic',
            color: 'var(--ink-soft)',
            maxWidth: '680px',
            margin: '0 auto',
          }}
        >
          &ldquo;La velocidad de los cables, la jerarquía de un gran diario y la memoria rebelde de las barrancas&rdquo;
        </p>

        <div className="rule-double" />

        <nav
          className="font-mono"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '6px 0',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            fontWeight: 600,
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link
              href="/"
              style={{
                textDecoration: 'none',
                color: !currentCategory ? 'var(--ink)' : 'var(--ink-soft)',
                borderBottom: !currentCategory ? '2px solid var(--red-urgent)' : '2px solid transparent',
                padding: '4px 0',
              }}
            >
              PORTADA
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={`/categoria/${cat.key}`}
                style={{
                  textDecoration: 'none',
                  color: currentCategory === cat.key ? 'var(--ink)' : 'var(--ink-soft)',
                  borderBottom: currentCategory === cat.key ? '2px solid var(--red-urgent)' : '2px solid transparent',
                  padding: '4px 0',
                }}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link
              href="/#kiosco-mundial"
              style={{
                border: '1px solid var(--ink)',
                color: 'var(--ink)',
                padding: '5px 12px',
                textDecoration: 'none',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '3px',
                backgroundColor: 'var(--paper-soft)',
              }}
            >
              <span>🌍 KIOSCO MUNDIAL</span>
            </Link>
            <Link
              href="/redaccion"
              style={{
                backgroundColor: 'var(--red-urgent)',
                color: '#FFFFFF',
                padding: '5px 14px',
                textDecoration: 'none',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                borderRadius: '3px',
                boxShadow: '0 2px 8px var(--red-glow)',
              }}
            >
              <span>SALA DE REDACCIÓN EN VIVO</span>
              <span>➔</span>
            </Link>
          </div>
        </nav>

        <div className="rule-single" />
      </div>
    </header>
  );
}
