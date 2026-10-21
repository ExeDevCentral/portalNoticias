'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NewsStory, DEFAULT_STORIES } from '../services/hero-stories';
import { IconArrowRight, IconClock } from './Icons';

interface RosarioHeroBannerProps {
  stories?: NewsStory[];
}

export default function RosarioHeroBanner({ stories = DEFAULT_STORIES }: RosarioHeroBannerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeStory = stories[selectedIndex] || stories[0] || DEFAULT_STORIES[0];

  return (
    <section
      aria-label="Noticia principal destacada"
      style={{
        margin: '0 0 24px 0',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Tarjeta Hero Principal (Editorial Rosario de Alta Fidelidad) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          backgroundColor: 'var(--paper-card)',
          border: '1px solid var(--ink-faint)',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Imagen Editorial de Gran Impacto */}
        <div
          style={{
            position: 'relative',
            minHeight: '340px',
            maxHeight: '440px',
            overflow: 'hidden',
            backgroundColor: '#000',
          }}
        >
          <img
            src={activeStory.imageUrl}
            alt={activeStory.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                backgroundColor: activeStory.accentColor || 'var(--blue-parana)',
                color: '#FFF',
                fontSize: '0.68rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                padding: '4px 10px',
                borderRadius: '4px',
                letterSpacing: '0.05em',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              {activeStory.tag || 'ROSARIO HOY'}
            </span>
            <span
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                color: '#FFF',
                backdropFilter: 'blur(6px)',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                padding: '4px 8px',
                borderRadius: '4px',
              }}
            >
              {activeStory.source}
            </span>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              color: '#FFF',
            }}
          >
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.04em',
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              CRÓNICA FLUVIAL & TERRITORIO ROSARINO
            </span>
          </div>
        </div>

        {/* Panel Editorial de Lectura */}
        <div
          style={{
            padding: '28px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
              }}
            >
              <span style={{ color: activeStory.accentColor || 'var(--blue-parana)', fontWeight: 800 }}>
                {activeStory.category}
              </span>
              <span style={{ color: 'var(--ink-soft)' }}>•</span>
              <span style={{ color: 'var(--ink-soft)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <IconClock size={11} /> {activeStory.time || 'Actualizado'}
              </span>
              <span style={{ color: 'var(--ink-soft)' }}>•</span>
              <span style={{ color: 'var(--ink-soft)' }}>{activeStory.readingTime || '3 min'}</span>
            </div>

            <Link
              href={`/noticia/${activeStory.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(1.5rem, 2.8vw, 2.1rem)',
                  fontWeight: 900,
                  lineHeight: 1.18,
                  color: 'var(--ink)',
                  margin: '0 0 14px 0',
                  transition: 'color 0.15s ease',
                }}
              >
                {activeStory.title}
              </h2>
            </Link>

            {/* Caja de Gancho Editorial */}
            <div
              style={{
                backgroundColor: 'var(--paper-elevated)',
                borderLeft: `4px solid ${activeStory.accentColor || 'var(--blue-parana)'}`,
                padding: '12px 16px',
                borderRadius: '4px',
                marginBottom: '16px',
              }}
            >
              <div
                className="font-mono"
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: activeStory.accentColor || 'var(--blue-parana)',
                  letterSpacing: '0.05em',
                  marginBottom: '4px',
                }}
              >
                ⚡ EN SÍNTESIS EDITORIAL
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.94rem',
                  lineHeight: 1.45,
                  color: 'var(--ink)',
                  fontWeight: 500,
                }}
              >
                {activeStory.hook || activeStory.summary}
              </p>
            </div>

            {/* Puntos Clave */}
            {activeStory.keyFacts && activeStory.keyFacts.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
                {activeStory.keyFacts.map((fact, idx) => (
                  <span
                    key={idx}
                    className="font-mono"
                    style={{
                      fontSize: '0.68rem',
                      backgroundColor: 'var(--paper-soft)',
                      border: '1px solid var(--ink-faint)',
                      padding: '3px 8px',
                      borderRadius: '3px',
                      color: 'var(--ink-soft)',
                      fontWeight: 600,
                    }}
                  >
                    ✓ {fact}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Botones de Acción Inmediata */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              flexWrap: 'wrap',
              paddingTop: '14px',
              borderTop: '1px solid var(--ink-faint)',
            }}
          >
            <Link
              href={`/noticia/${activeStory.slug}`}
              style={{
                backgroundColor: activeStory.accentColor || 'var(--ink)',
                color: '#FFFFFF',
                padding: '10px 18px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                letterSpacing: '0.03em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.15s ease',
              }}
            >
              <span>LEER CRÓNICA COMPLETA</span>
              <IconArrowRight size={14} />
            </Link>

            {activeStory.sourceUrl && (
              <a
                href={activeStory.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  border: '1px solid var(--ink-faint)',
                  backgroundColor: 'var(--paper-soft)',
                  color: 'var(--ink)',
                  padding: '9px 14px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Fuente: {activeStory.source}</span>
                <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 3. Selector de Píldoras Rápidas de Rosario */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '12px 0 0 0',
          scrollbarWidth: 'none',
        }}
      >
        {stories.slice(0, 5).map((story, idx) => {
          const isCurrent = idx === selectedIndex;
          return (
            <button
              key={story.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              style={{
                padding: '8px 14px',
                borderRadius: '20px',
                border: isCurrent
                  ? `2px solid ${story.accentColor || 'var(--ink)'}`
                  : '1px solid var(--ink-faint)',
                backgroundColor: isCurrent ? 'var(--paper-elevated)' : 'transparent',
                color: isCurrent ? 'var(--ink)' : 'var(--ink-soft)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                fontWeight: isCurrent ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
                boxShadow: isCurrent ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: story.accentColor || 'var(--blue-parana)',
                }}
              />
              <span>{story.tag || story.category}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
