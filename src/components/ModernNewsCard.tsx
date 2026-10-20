'use client';

import React from 'react';
import Link from 'next/link';
import { NewsItem } from '../db/schema';
import { formatTimeAgo } from '../utils/formatters';
import { IconArrowRight, IconClock } from './Icons';

interface ModernNewsCardProps {
  item: NewsItem;
  variant?: 'compact' | 'card' | 'lead';
  showCategory?: boolean;
}

const SOURCE_COLORS: Record<string, { dot: string; text: string }> = {
  'La Capital': { dot: '#1E40AF', text: '#93C5FD' },
  'Rosario3': { dot: '#EA580C', text: '#FDBA74' },
  'Rosario3 Deportes': { dot: '#EA580C', text: '#FDBA74' },
  'Rosario3 / Seguridad': { dot: '#EA580C', text: '#FDBA74' },
  'El Ciudadano': { dot: '#DC2626', text: '#FCA5A5' },
  'Infobae': { dot: '#F97316', text: '#FFEDD5' },
  'Clarín': { dot: '#EF4444', text: '#FEE2E2' },
  'Ámbito Financiero': { dot: '#3B82F6', text: '#DBEAFE' },
  'Prensa Federal': { dot: '#8B5CF6', text: '#EDE9FE' },
  'La Nación': { dot: '#8B5CF6', text: '#EDE9FE' },
  'Bolsa de Comercio': { dot: '#059669', text: '#6EE7B7' },
  'Cultura Rosario': { dot: '#A855F7', text: '#F3E8FF' },
};

function getSourceStyle(source: string) {
  const displaySource = source === 'La Nación' ? 'Prensa Federal' : source;
  const colors = SOURCE_COLORS[displaySource] || { dot: 'var(--ink-soft)', text: 'var(--ink)' };
  return { displaySource, colors };
}

export default function ModernNewsCard({
  item,
  variant = 'compact',
  showCategory = true,
}: ModernNewsCardProps) {
  const { displaySource, colors } = getSourceStyle(item.source);

  // Variante COMPACTA HORIZONTAL (Ultra-eficiente, achica la página en un 55%)
  if (variant === 'compact') {
    return (
      <article
        className="modern-news-card-compact group"
        style={{
          backgroundColor: 'var(--paper-card)',
          border: '1px solid var(--ink-faint)',
          borderRadius: '10px',
          padding: '12px 14px',
          display: 'grid',
          gridTemplateColumns: item.imageUrl ? '1fr 140px' : '1fr',
          gap: '14px',
          alignItems: 'center',
          transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--ink-faint)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {/* Fila de Metadatos */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.68rem',
              fontFamily: 'var(--font-mono)',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 800,
                color: 'var(--ink)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: colors.dot,
                }}
              />
              <span>{displaySource}</span>
            </span>

            <span style={{ color: 'var(--ink-soft)' }}>•</span>

            <span
              style={{
                color: 'var(--ink-soft)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <IconClock size={10} />
              <span>{formatTimeAgo(item.publishedAt)}</span>
            </span>

            {showCategory && item.category && (
              <>
                <span style={{ color: 'var(--ink-soft)' }}>•</span>
                <span
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '0.62rem',
                    color: 'var(--ink-soft)',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}
                >
                  {item.category}
                </span>
              </>
            )}

            {item.isUrgent && (
              <span
                style={{
                  backgroundColor: 'var(--red-urgent)',
                  color: '#FFFFFF',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: '3px',
                  letterSpacing: '0.04em',
                }}
              >
                URGENTE
              </span>
            )}
          </div>

          {/* Titular */}
          <Link
            href={`/noticia/${item.slug}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <h4
              className="font-display"
              style={{
                fontSize: '1.02rem',
                fontWeight: 700,
                lineHeight: 1.25,
                color: 'var(--ink)',
                margin: '2px 0 3px 0',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                transition: 'color 0.15s ease',
              }}
            >
              {item.title}
            </h4>
          </Link>

          {/* Resumen conciso de 1-2 líneas */}
          {item.summary && (
            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--ink-soft)',
                lineHeight: 1.35,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {item.summary}
            </p>
          )}

          {/* Pie de acción */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '4px',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <Link
              href={`/noticia/${item.slug}`}
              style={{
                color: 'var(--red-urgent)',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>LEER COMPLETA</span>
              <IconArrowRight size={11} />
            </Link>

            {item.sourceUrl && (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Ver en ${displaySource} original`}
                style={{
                  color: 'var(--ink-soft)',
                  textDecoration: 'none',
                  fontSize: '0.64rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  opacity: 0.7,
                }}
              >
                <span>Fuente ↗</span>
              </a>
            )}
          </div>
        </div>

        {/* Imagen Lateral Compacta con hover zoom */}
        {item.imageUrl && (
          <div
            style={{
              height: '92px',
              borderRadius: '6px',
              overflow: 'hidden',
              backgroundColor: '#0a0d14',
              position: 'relative',
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          </div>
        )}
      </article>
    );
  }

  // Variante CARD VERTICAL PARA CUADRÍCULA (Grid Moderno)
  return (
    <article
      className="modern-news-card-vertical"
      style={{
        backgroundColor: 'var(--paper-card)',
        border: '1px solid var(--ink-faint)',
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--ink-faint)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Contenedor de Imagen con Overlay */}
      {item.imageUrl && (
        <div
          style={{
            height: '135px',
            overflow: 'hidden',
            backgroundColor: '#0a0d14',
            position: 'relative',
          }}
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              display: 'flex',
              gap: '5px',
            }}
          >
            <span
              style={{
                backgroundColor: 'rgba(11, 15, 23, 0.85)',
                backdropFilter: 'blur(4px)',
                color: '#FFF',
                fontSize: '0.64rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
                border: `1px solid ${colors.dot}88`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: colors.dot,
                }}
              />
              <span>{displaySource}</span>
            </span>

            {item.isUrgent && (
              <span
                style={{
                  backgroundColor: 'var(--red-urgent)',
                  color: '#FFF',
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                URGENTE
              </span>
            )}
          </div>
        </div>
      )}

      {/* Contenido Editorial */}
      <div
        style={{
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <div>
          {/* Línea de Fecha / Categoría si no hubo imagen */}
          {!item.imageUrl && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                marginBottom: '4px',
              }}
            >
              <span style={{ color: colors.dot, fontWeight: 800 }}>{displaySource}</span>
              <span style={{ color: 'var(--ink-soft)' }}>•</span>
              <span style={{ color: 'var(--ink-soft)' }}>{formatTimeAgo(item.publishedAt)}</span>
            </div>
          )}

          <Link
            href={`/noticia/${item.slug}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <h4
              className="font-display"
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                lineHeight: 1.25,
                color: 'var(--ink)',
                margin: '0 0 6px 0',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {item.title}
            </h4>
          </Link>

          <p
            style={{
              fontSize: '0.82rem',
              color: 'var(--ink-soft)',
              lineHeight: 1.38,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {item.summary}
          </p>
        </div>

        {/* Barra Inferior */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--ink-faint)',
            paddingTop: '8px',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <Link
            href={`/noticia/${item.slug}`}
            style={{
              color: 'var(--red-urgent)',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>LEER NOTA</span>
            <IconArrowRight size={11} />
          </Link>

          <span
            style={{
              color: 'var(--ink-soft)',
              fontSize: '0.64rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <IconClock size={10} />
            <span>{formatTimeAgo(item.publishedAt)}</span>
          </span>
        </div>
      </div>
    </article>
  );
}
