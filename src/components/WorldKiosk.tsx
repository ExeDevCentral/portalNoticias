'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { CableItem } from '@/types/cables';

const NEWSPAPER_TABS = [
  { key: 'all', label: 'Todos los Diarios', flag: '🌍' },
  { key: 'BBC Mundo', label: 'BBC Mundo', flag: '🇬🇧' },
  { key: 'El País', label: 'El País', flag: '🇪🇸' },
  { key: 'Clarín', label: 'Clarín', flag: '🇦🇷' },
  { key: 'Infobae', label: 'Infobae', flag: '🌎' },
  { key: 'DW Español', label: 'DW Español', flag: '🇩🇪' },
];

export default function WorldKiosk() {
  const [cables, setCables] = useState<CableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSource, setActiveSource] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedCable, setSelectedCable] = useState<CableItem | null>(null);

  useEffect(() => {
    fetch('/api/cables')
      .then((res) => res.json())
      .then((data) => {
        if (data.cables) {
          setCables(data.cables);
        }
      })
      .catch((err) => console.error('Error fetching world cables:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredCables = cables.filter((item) => {
    const matchesSource =
      activeSource === 'all' || item.source.toLowerCase().includes(activeSource.toLowerCase());
    const matchesSearch =
      !search ||
      item.originalTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.originalSummary.toLowerCase().includes(search.toLowerCase()) ||
      (item.ironicReview?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (item.warningTag?.toLowerCase().includes(search.toLowerCase()) ?? false);

    return matchesSource && matchesSearch;
  });

  let kioskGridContent: React.ReactNode;
  if (loading) {
    kioskGridContent = (
      <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-mono)' }}>
        <p style={{ color: 'var(--ink-soft)' }}>
          📡 Sintonizando teletipos de las agencias mundiales...
        </p>
      </div>
    );
  } else if (filteredCables.length === 0) {
    kioskGridContent = (
      <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-mono)' }}>
        <p style={{ color: 'var(--ink-soft)' }}>
          No se encontraron despachos con el filtro indicado.
        </p>
      </div>
    );
  } else {
    kioskGridContent = (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {filteredCables.map((cable) => (
          <article
            key={cable.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid var(--ink-faint)',
              backgroundColor: 'var(--paper-soft)',
              borderRadius: '3px',
              overflow: 'hidden',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            {/* Imagen del despacho */}
            {cable.imageUrl && (
              <div style={{ position: 'relative', width: '100%', height: '170px' }}>
                <Image
                  src={cable.imageUrl}
                  alt={cable.originalTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  style={{ objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '2px',
                    backdropFilter: 'blur(2px)',
                  }}
                >
                  {cable.source}
                </div>
              </div>
            )}

            {/* Cuerpo de la noticia */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--ink-soft)',
                  marginBottom: '8px',
                }}
              >
                <span>{cable.category}</span>
                <span>{new Date(cable.publishedAt).toLocaleDateString('es-AR')}</span>
              </div>

              {/* Titular Original (100% auténtico) */}
              <h3
                className="font-display"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  lineHeight: 1.25,
                  color: 'var(--ink)',
                  margin: '0 0 10px 0',
                }}
              >
                {cable.originalTitle}
              </h3>

              {/* Resumen Original */}
              <p
                className="font-body"
                style={{
                  fontSize: '0.9rem',
                  color: 'var(--ink-soft)',
                  lineHeight: 1.45,
                  margin: '0 0 16px 0',
                  flex: 1,
                }}
              >
                {cable.originalSummary}
              </p>

              {/* Caja de la Reseña Irónica */}
              <div
                style={{
                  marginTop: 'auto',
                  padding: '12px',
                  backgroundColor: 'var(--paper)',
                  borderLeft: '3px solid var(--red-urgent)',
                  borderTop: '1px solid var(--ink-faint)',
                  borderRight: '1px solid var(--ink-faint)',
                  borderBottom: '1px solid var(--ink-faint)',
                  borderRadius: '2px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: 'var(--red-urgent)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    ⚡ {cable.warningTag || 'ADVERTENCIA EDITORIAL'}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: '0.88rem',
                    lineHeight: 1.35,
                    color: 'var(--ink)',
                    margin: '0 0 6px 0',
                  }}
                >
                  &ldquo;{cable.ironicReview}&rdquo;
                </p>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--ink-soft)',
                  }}
                >
                  * Nota original no influenciada
                </span>
              </div>

              {/* Botón 1-Click a la fuente oficial */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={cable.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    backgroundColor: 'var(--ink)',
                    color: 'var(--paper)',
                    padding: '9px 12px',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    borderRadius: '3px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <span>Leer en {cable.source}</span>
                  <span>↗</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedCable(cable)}
                  title="Ver ficha editorial completa"
                  style={{
                    padding: '9px 12px',
                    backgroundColor: 'transparent',
                    color: 'var(--ink)',
                    border: '1px solid var(--ink-faint)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    borderRadius: '3px',
                    cursor: 'pointer',
                  }}
                >
                  🔍
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <section
      id="kiosco-mundial"
      style={{
        margin: '48px 0',
        padding: '32px 24px',
        border: '2px solid var(--ink)',
        backgroundColor: 'var(--paper)',
        borderRadius: '4px',
        boxShadow: '4px 4px 0px var(--ink)',
      }}
    >
      {/* Encabezado del Kiosco */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '2px solid var(--ink)',
          paddingBottom: '20px',
          marginBottom: '24px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span
              style={{
                backgroundColor: 'var(--red-urgent)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '2px',
                letterSpacing: '0.08em',
              }}
            >
              ACCESO DIRECTO 1-CLICK
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--ink-soft)',
                letterSpacing: '0.05em',
              }}
            >
              📡 CABLES DEL MUNDO & OJO CRÍTICO
            </span>
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
              fontWeight: 900,
              color: 'var(--ink)',
              margin: '0 0 6px 0',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Kiosco Mundial de Diarios
          </h2>
          <p
            className="font-body"
            style={{
              fontSize: '1rem',
              color: 'var(--ink-soft)',
              margin: 0,
              maxWidth: '680px',
            }}
          >
            Entrá directo con un solo click a las portadas de los principales diarios del mundo.
            Nuestra redacción añade una <strong>advertencia irónica</strong> para leer entre líneas,
            {' '}<strong>sin alterar una sola coma de la nota original</strong>.
          </p>
        </div>

        {/* Buscador de cables */}
        <div style={{ minWidth: '240px', flex: '1 1 260px', maxWidth: '380px' }}>
          <input
            type="text"
            placeholder="Filtrar por tema, palabra o ironía..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              backgroundColor: 'var(--paper-soft)',
              color: 'var(--ink)',
              border: '1px solid var(--ink-faint)',
              borderRadius: '3px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Selector de Diarios (Pills) */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '24px',
        }}
      >
        {NEWSPAPER_TABS.map((tab) => {
          const isActive = activeSource === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveSource(tab.key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: isActive ? 700 : 500,
                border: isActive ? '1px solid var(--red-urgent)' : '1px solid var(--ink-faint)',
                backgroundColor: isActive ? 'var(--red-urgent)' : 'var(--paper-soft)',
                color: isActive ? '#FFFFFF' : 'var(--ink)',
                borderRadius: '3px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.flag}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenido / Grilla de cables */}
      {kioskGridContent}

      {/* Modal / Ficha Editorial Ampliada */}
      {selectedCable && (
        <dialog
          open
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            maxWidth: '100vw',
            maxHeight: '100vh',
            margin: 0,
            border: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
            backdropFilter: 'blur(3px)',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSelectedCable(null);
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--paper)',
              border: '2px solid var(--ink)',
              borderRadius: '4px',
              maxWidth: '640px',
              width: '100%',
              padding: '24px',
              boxShadow: '6px 6px 0px var(--ink)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedCable(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: 'var(--ink)',
              }}
            >
              ✕
            </button>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--red-urgent)',
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}
            >
              FICHA DE COTEJO EDITORIAL
            </span>

            <h3
              className="font-display"
              style={{
                fontSize: '1.4rem',
                margin: '8px 0 16px 0',
                color: 'var(--ink)',
              }}
            >
              {selectedCable.originalTitle}
            </h3>

            <div
              style={{
                backgroundColor: 'var(--paper-soft)',
                padding: '14px',
                border: '1px solid var(--ink-faint)',
                borderRadius: '3px',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--ink-soft)',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                📰 FUENTE ORIGINAL INTACTA ({selectedCable.source}):
              </span>
              <p
                className="font-body"
                style={{ fontSize: '0.95rem', margin: 0, color: 'var(--ink)' }}
              >
                {selectedCable.originalSummary}
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'var(--paper-soft)',
                padding: '14px',
                borderLeft: '4px solid var(--red-urgent)',
                border: '1px solid var(--ink-faint)',
                borderRadius: '3px',
                marginBottom: '20px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--red-urgent)',
                  fontWeight: 700,
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                ⚡ {selectedCable.warningTag}
              </span>
              <p
                className="font-display"
                style={{
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  margin: 0,
                  color: 'var(--ink)',
                }}
              >
                &ldquo;{selectedCable.ironicReview}&rdquo;
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedCable(null)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--ink-faint)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  borderRadius: '3px',
                  color: 'var(--ink)',
                }}
              >
                Cerrar
              </button>
              <a
                href={selectedCable.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 20px',
                  backgroundColor: 'var(--red-urgent)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  borderRadius: '3px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Abrir nota completa en {selectedCable.source}</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
