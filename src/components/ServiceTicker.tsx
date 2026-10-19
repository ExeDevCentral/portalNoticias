'use client';

import React from 'react';
import { formatServiceData } from '../utils/formatters';

interface ServiceTickerProps {
  onToggleTheme?: () => void;
  theme?: 'light' | 'dark';
}

export default function ServiceTicker({ onToggleTheme, theme = 'dark' }: ServiceTickerProps) {
  const serviceText = formatServiceData({
    temp: 22,
    weatherDesc: 'Soleado (Viento del Río)',
    dolarBlue: 1250,
    paranaLevel: '3.42m (Creciendo)',
    puenteRosarioVictoria: 'Normal',
  });

  return (
    <div
      style={{
        borderBottom: '1px solid var(--ink-faint)',
        padding: '6px 0',
        fontSize: '0.8rem',
        backgroundColor: 'var(--paper-elevated)',
      }}
    >
      <div
        className="editorial-container font-mono"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'var(--ink-soft)',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: 'var(--ink)', fontWeight: 700 }}>ROSARIO, SANTA FE</span>
          <span>•</span>
          <span>{serviceText}</span>
        </div>
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            style={{
              background: 'none',
              border: '1px solid var(--ink-faint)',
              padding: '3px 10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              cursor: 'pointer',
              color: 'var(--ink)',
              borderRadius: '3px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
            }}
          >
            {theme === 'dark' ? '☀️ MODO DÍA' : '🌙 MODO NOCTURNO'}
          </button>
        )}
      </div>
    </div>
  );
}
