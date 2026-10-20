'use client';

import React from 'react';
import {
  MediaOutlet,
  ROSARIO_OUTLETS,
  NATIONAL_OUTLETS,
} from '../services/media-outlets';

export type { MediaOutlet };
export { ROSARIO_OUTLETS, NATIONAL_OUTLETS };

interface MediaQuickRailProps {
  side: 'left' | 'right';
  activeSource: string | null;
  onSelectSource: (source: string | null) => void;
  sourceCounts?: Record<string, number>;
}

export function MediaSideRail({ side, activeSource, onSelectSource, sourceCounts = {} }: MediaQuickRailProps) {
  const isLeft = side === 'left';
  const outlets = isLeft ? ROSARIO_OUTLETS : NATIONAL_OUTLETS;
  const title = isLeft ? 'DIARIOS DE ROSARIO' : 'DIARIOS NACIONALES';
  const subtitle = isLeft ? 'Región & Cordón' : 'Agenda del País';
  const icon = isLeft ? '📍' : '🇦🇷';

  return (
    <aside
      className="media-quick-rail"
      aria-label={title}
      style={{
        width: '210px',
        flexShrink: 0,
        position: 'sticky',
        top: '65px',
        maxHeight: 'calc(100vh - 80px)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '12px 10px',
        backgroundColor: 'var(--paper-elevated)',
        border: '1px solid var(--ink-faint)',
        borderRadius: '10px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        scrollbarWidth: 'none',
      }}
    >
      {/* Cabecera del Flanco Lateral */}
      <div
        style={{
          borderBottom: '1px solid var(--ink-faint)',
          paddingBottom: '8px',
          marginBottom: '2px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            className="font-mono"
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: isLeft ? 'var(--blue-parana)' : 'var(--red-urgent)',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span>{icon}</span>
            <span>{title}</span>
          </span>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isLeft ? 'var(--blue-parana)' : 'var(--red-urgent)',
              boxShadow: `0 0 8px ${isLeft ? 'var(--blue-parana)' : 'var(--red-urgent)'}`,
            }}
          />
        </div>
        <div
          style={{
            fontSize: '0.66rem',
            color: 'var(--ink-soft)',
            marginTop: '2px',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {subtitle} • 1 click para filtrar
        </div>
      </div>

      {/* Lista de Medios */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {outlets.map((outlet) => {
          const isActive = activeSource?.toLowerCase() === outlet.filterKey.toLowerCase();
          const count = sourceCounts[outlet.filterKey] ?? (sourceCounts[outlet.name] ?? null);

          return (
            <div
              key={outlet.id}
              style={{
                position: 'relative',
                borderRadius: '8px',
                border: isActive
                  ? `2px solid ${outlet.brandColor}`
                  : '1px solid var(--ink-faint)',
                backgroundColor: isActive
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'var(--paper-card)',
                boxShadow: isActive ? `0 0 14px ${outlet.brandColor}33` : 'none',
                transition: 'all 0.18s ease',
                overflow: 'hidden',
              }}
            >
              {/* Botón principal de Filtrado interno */}
              <button
                type="button"
                onClick={() => onSelectSource(isActive ? null : outlet.filterKey)}
                title={`Filtrar noticias de ${outlet.name}`}
                style={{
                  width: '100%',
                  padding: '7px 8px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'inherit',
                }}
              >
                {/* Monograma / Escudo de Prensa */}
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '6px',
                    backgroundColor: outlet.badgeBg,
                    color: outlet.badgeText,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    flexShrink: 0,
                    border: `1px solid ${outlet.brandColor}55`,
                  }}
                >
                  {outlet.shortName}
                </div>

                {/* Texto del Medio */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '4px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        color: 'var(--ink)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {outlet.name}
                    </span>
                    {count !== null && (
                      <span
                        className="font-mono"
                        style={{
                          fontSize: '0.62rem',
                          color: 'var(--ink-soft)',
                          backgroundColor: 'var(--paper-elevated)',
                          padding: '1px 4px',
                          borderRadius: '3px',
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: '0.62rem',
                      color: isActive ? outlet.brandColor : 'var(--ink-soft)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontWeight: isActive ? 700 : 400,
                    }}
                  >
                    {isActive ? '● FILTRANDO' : outlet.tagline}
                  </div>
                </div>
              </button>

              {/* Botón directo para abrir sitio web original en nueva pestaña */}
              <a
                href={outlet.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`Ir a ${outlet.name} oficial (abre en nueva pestaña)`}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  padding: '3px 4px',
                  borderRadius: '3px',
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--ink-soft)',
                  textDecoration: 'none',
                  opacity: 0.65,
                  transition: 'opacity 0.15s ease',
                  backgroundColor: 'var(--paper-elevated)',
                  border: '1px solid var(--ink-faint)',
                  lineHeight: 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.color = outlet.brandColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.65';
                  e.currentTarget.style.color = 'var(--ink-soft)';
                }}
              >
                ↗
              </a>
            </div>
          );
        })}
      </div>

      {/* Botón Reset si hay filtro activo */}
      {activeSource && (
        <button
          type="button"
          onClick={() => onSelectSource(null)}
          style={{
            marginTop: '4px',
            padding: '6px 8px',
            backgroundColor: 'var(--paper-card)',
            border: '1px dashed var(--ink-soft)',
            color: 'var(--ink-soft)',
            borderRadius: '6px',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.15s ease',
          }}
        >
          ✕ Ver Todos los Diarios
        </button>
      )}
    </aside>
  );
}

/**
 * Barra Horizontal compacta para pantallas menores a 1360px
 * Asegura que los usuarios de laptops y celulares también puedan entrar a los diarios rápidamente.
 */
export function MediaHorizontalBar({
  activeSource,
  onSelectSource,
}: {
  activeSource: string | null;
  onSelectSource: (source: string | null) => void;
}) {
  const allOutlets = [...ROSARIO_OUTLETS, ...NATIONAL_OUTLETS];

  return (
    <div
      className="media-horizontal-bar"
      style={{
        margin: '12px 0 16px 0',
        padding: '8px 12px',
        backgroundColor: 'var(--paper-elevated)',
        border: '1px solid var(--ink-faint)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          fontWeight: 800,
          color: 'var(--ink-soft)',
          whiteSpace: 'nowrap',
          paddingRight: '6px',
          borderRight: '1px solid var(--ink-faint)',
        }}
      >
        <span>⚡ ACCESO RÁPIDO:</span>
      </div>

      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        {allOutlets.map((outlet) => {
          const isActive = activeSource?.toLowerCase() === outlet.filterKey.toLowerCase();
          return (
            <button
              key={outlet.id}
              type="button"
              onClick={() => onSelectSource(isActive ? null : outlet.filterKey)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 9px',
                borderRadius: '6px',
                border: isActive
                  ? `2px solid ${outlet.brandColor}`
                  : '1px solid var(--ink-faint)',
                backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'var(--paper-card)',
                color: isActive ? outlet.brandColor : 'var(--ink)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: isActive ? 800 : 600,
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: outlet.brandColor,
                }}
              />
              <span>{outlet.name}</span>
            </button>
          );
        })}

        {activeSource && (
          <button
            type="button"
            onClick={() => onSelectSource(null)}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px dashed var(--ink-soft)',
              backgroundColor: 'transparent',
              color: 'var(--ink-soft)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            ✕ Limpiar filtro
          </button>
        )}
      </div>
    </div>
  );
}
