'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import type { CableItem } from '@/types/cables';

type ScopeKey = 'all' | 'eeuu' | 'europa' | 'asia' | 'rusia' | 'argentina';

interface ScopeOption {
  key: ScopeKey;
  label: string;
  icon: string;
  badge: string;
  description: string;
}

const SCOPES: ScopeOption[] = [
  { key: 'all', label: 'Todos los Diarios', icon: '🌍', badge: 'MUNDIAL', description: 'Cobertura unificada de los mejores diarios del mundo' },
  { key: 'eeuu', label: 'EEUU', icon: '🇺🇸', badge: 'ESTADOS UNIDOS', description: 'The New York Times, CNN en Español' },
  { key: 'europa', label: 'Europa', icon: '🇪🇺', badge: 'UNIÓN EUROPEA & UK', description: 'BBC Mundo, El País, DW Español, The Guardian' },
  { key: 'asia', label: 'Asia', icon: '🌏', badge: 'MEDIO ORIENTE & ASIA', description: 'Al Jazeera' },
  { key: 'rusia', label: 'Rusia', icon: '🇷🇺', badge: 'EURASIA', description: 'RT en Español, Sputnik Mundo' },
  { key: 'argentina', label: 'Argentina & Rosario', icon: '🇦🇷', badge: 'NACIONAL & LITORAL', description: 'Clarín, La Nación, Infobae, Ámbito, La Capital' },
];

interface NewspaperBrand {
  name: string;
  badge: string;
  flag: string;
  scope: ScopeKey;
  tagline: string;
  accentColor: string;
  textColor: string;
}

const NEWSPAPER_DIRECTORY: Record<string, NewspaperBrand> = {
  'The New York Times': {
    name: 'The New York Times',
    badge: 'NYT',
    flag: '🇺🇸',
    scope: 'eeuu',
    tagline: 'All the news that’s fit to print',
    accentColor: '#111827',
    textColor: '#FFFFFF',
  },
  'CNN en Español': {
    name: 'CNN en Español',
    badge: 'CNN',
    flag: '🇺🇸',
    scope: 'eeuu',
    tagline: 'Líder mundial de noticias en español',
    accentColor: '#CC0000',
    textColor: '#FFFFFF',
  },
  'BBC Mundo': {
    name: 'BBC Mundo',
    badge: 'BBC MUNDO',
    flag: '🇬🇧',
    scope: 'europa',
    tagline: 'Servicio mundial en español',
    accentColor: '#B91C1C',
    textColor: '#FFFFFF',
  },
  'El País': {
    name: 'El País',
    badge: 'EL PAÍS',
    flag: '🇪🇸',
    scope: 'europa',
    tagline: 'El periódico global en español',
    accentColor: '#1D4ED8',
    textColor: '#FFFFFF',
  },
  'The Guardian': {
    name: 'The Guardian',
    badge: 'GUARDIAN',
    flag: '🇬🇧',
    scope: 'europa',
    tagline: 'Independent global journalism',
    accentColor: '#052962',
    textColor: '#FFFFFF',
  },
  'DW Español': {
    name: 'DW Español',
    badge: 'DW',
    flag: '🇩🇪',
    scope: 'europa',
    tagline: 'La voz de Alemania para el mundo',
    accentColor: '#0284C7',
    textColor: '#FFFFFF',
  },
  'RT en Español': {
    name: 'RT en Español',
    badge: 'RT',
    flag: '🇷🇺',
    scope: 'rusia',
    tagline: 'Actualidad RT • Cuestione más',
    accentColor: '#16A34A',
    textColor: '#FFFFFF',
  },
  'Sputnik Mundo': {
    name: 'Sputnik Mundo',
    badge: 'SPUTNIK',
    flag: '🇷🇺',
    scope: 'rusia',
    tagline: 'Decimos lo que otros callan',
    accentColor: '#EA580C',
    textColor: '#FFFFFF',
  },
  'Al Jazeera': {
    name: 'Al Jazeera',
    badge: 'AL JAZEERA',
    flag: '🌏',
    scope: 'asia',
    tagline: 'Voz del Medio Oriente y Asia',
    accentColor: '#D97706',
    textColor: '#FFFFFF',
  },
  'Clarín': {
    name: 'Clarín',
    badge: 'CLARÍN',
    flag: '🇦🇷',
    scope: 'argentina',
    tagline: 'El gran diario argentino',
    accentColor: '#DC2626',
    textColor: '#FFFFFF',
  },
  'La Nación': {
    name: 'La Nación',
    badge: 'LA NACIÓN',
    flag: '🇦🇷',
    scope: 'argentina',
    tagline: 'Tradición y análisis político',
    accentColor: '#1E3A8A',
    textColor: '#FFFFFF',
  },
  'Infobae': {
    name: 'Infobae',
    badge: 'INFOBAE',
    flag: '🌎',
    scope: 'argentina',
    tagline: 'Periodismo digital en tiempo real',
    accentColor: '#EA580C',
    textColor: '#FFFFFF',
  },
  'Ámbito Financiero': {
    name: 'Ámbito Financiero',
    badge: 'ÁMBITO',
    flag: '🇦🇷',
    scope: 'argentina',
    tagline: 'Economía, finanzas y mercados',
    accentColor: '#0F172A',
    textColor: '#FFFFFF',
  },
  'La Capital': {
    name: 'La Capital',
    badge: 'LA CAPITAL',
    flag: '⚓',
    scope: 'argentina',
    tagline: 'Decano de la Prensa Argentina • Rosario',
    accentColor: '#0284C7',
    textColor: '#FFFFFF',
  },
  'El Ciudadano': {
    name: 'El Ciudadano',
    badge: 'EL CIUDADANO',
    flag: '⚓',
    scope: 'argentina',
    tagline: 'Periodismo cooperativo rosarino',
    accentColor: '#9333EA',
    textColor: '#FFFFFF',
  },
};

function getBrandForSource(source: string, cableRegion?: string): NewspaperBrand {
  for (const [key, brand] of Object.entries(NEWSPAPER_DIRECTORY)) {
    if (source.toLowerCase().includes(key.toLowerCase())) {
      return brand;
    }
  }

  const scope: ScopeKey =
    cableRegion === 'eeuu' ||
    cableRegion === 'europa' ||
    cableRegion === 'asia' ||
    cableRegion === 'rusia' ||
    cableRegion === 'argentina'
      ? (cableRegion as ScopeKey)
      : 'europa';

  return {
    name: source,
    badge: source.toUpperCase().slice(0, 10),
    flag: '📰',
    scope,
    tagline: 'Prensa Internacional',
    accentColor: 'var(--ink)',
    textColor: 'var(--paper)',
  };
}

export default function WorldKiosk() {
  const [cables, setCables] = useState<CableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeScope, setActiveScope] = useState<ScopeKey>('all');
  const [activeSource, setActiveSource] = useState<string>('all');
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

  // Diarios únicos disponibles ordenados
  const availableSources = useMemo(() => {
    const set = new Set<string>();
    for (const c of cables) {
      set.add(c.source);
    }
    return Array.from(set);
  }, [cables]);

  const filteredCables = useMemo(() => {
    return cables.filter((item) => {
      const brand = getBrandForSource(item.source, item.region);

      // Filtro por región/ámbito (Scope)
      const matchesScope =
        activeScope === 'all' ||
        item.region === activeScope ||
        brand.scope === activeScope;

      // Filtro por diario específico
      const matchesSource =
        activeSource === 'all' || item.source.toLowerCase().includes(activeSource.toLowerCase());

      // Filtro por búsqueda de texto
      const matchesSearch =
        !search ||
        item.originalTitle.toLowerCase().includes(search.toLowerCase()) ||
        item.originalSummary.toLowerCase().includes(search.toLowerCase()) ||
        item.source.toLowerCase().includes(search.toLowerCase()) ||
        (item.ironicReview?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (item.warningTag?.toLowerCase().includes(search.toLowerCase()) ?? false);

      return matchesScope && matchesSource && matchesSearch;
    });
  }, [cables, activeScope, activeSource, search]);

  let kioskGridContent: React.ReactNode;
  if (loading) {
    kioskGridContent = (
      <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--font-mono)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '14px' }}>📡</div>
        <p style={{ color: 'var(--ink)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '6px' }}>
          Conectando cables directos de EEUU, Europa, Asia, Rusia y Argentina...
        </p>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.86rem' }}>
          Sintonizando teletipos oficiales de The New York Times, CNN, BBC, El País, RT, Sputnik, Clarín, La Nación y La Capital.
        </p>
      </div>
    );
  } else if (filteredCables.length === 0) {
    kioskGridContent = (
      <div
        style={{
          textAlign: 'center',
          padding: '48px 24px',
          fontFamily: 'var(--font-mono)',
          backgroundColor: 'var(--paper-elevated)',
          border: '1px dashed var(--ink-faint)',
          borderRadius: '4px',
        }}
      >
        <p style={{ color: 'var(--ink)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
          No se encontraron despachos con los filtros seleccionados.
        </p>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.85rem', marginBottom: '16px' }}>
          Probá seleccionando &ldquo;Todos los Diarios&rdquo; o limpiando la barra de búsqueda.
        </p>
        <button
          type="button"
          onClick={() => {
            setActiveScope('all');
            setActiveSource('all');
            setSearch('');
          }}
          style={{
            padding: '9px 20px',
            backgroundColor: 'var(--ink)',
            color: 'var(--paper)',
            border: 'none',
            borderRadius: '3px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          RESTABLECER TODOS LOS FILTROS
        </button>
      </div>
    );
  } else {
    kioskGridContent = (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '28px',
        }}
      >
        {filteredCables.map((cable) => {
          const brand = getBrandForSource(cable.source, cable.region);
          return (
            <article
              key={cable.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '2px solid var(--ink)',
                backgroundColor: 'var(--paper-card)',
                borderRadius: '4px',
                overflow: 'hidden',
                boxShadow: '4px 4px 0px var(--ink)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              {/* Cabezal del Diario con Identidad Oficial */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '9px 14px',
                  backgroundColor: 'var(--paper-elevated)',
                  borderBottom: '1px solid var(--ink)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      backgroundColor: brand.accentColor,
                      color: brand.textColor,
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '3px 9px',
                      borderRadius: '2px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {brand.flag} {brand.badge}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: 'var(--ink-soft)',
                      fontWeight: 600,
                    }}
                  >
                    {cable.category}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--ink-soft)',
                    fontWeight: 500,
                  }}
                >
                  {new Date(cable.publishedAt).toLocaleDateString('es-AR', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>

              {/* Imagen del despacho con vignette y acceso 1-click directo */}
              {cable.imageUrl && (
                <div style={{ position: 'relative', width: '100%', height: '180px', backgroundColor: 'var(--ink-faint)' }}>
                  <Image
                    src={cable.imageUrl}
                    alt={cable.originalTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    style={{ objectFit: 'cover' }}
                  />
                  <a
                    href={cable.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Abrir artículo original completo en ${cable.source}`}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(0, 0, 0, 0.85)',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      padding: '4px 9px',
                      borderRadius: '2px',
                      letterSpacing: '0.06em',
                      textDecoration: 'none',
                      backdropFilter: 'blur(3px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <span>NOTICIA REAL DIRECTA</span>
                    <span>↗</span>
                  </a>
                </div>
              )}

              {/* Contenido Editorial de la Noticia */}
              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Titular Original (100% auténtico e intacto) con enlace directo */}
                <h3
                  className="font-display"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    lineHeight: 1.25,
                    color: 'var(--ink)',
                    margin: '0 0 10px 0',
                    letterSpacing: '-0.015em',
                  }}
                >
                  <a
                    href={cable.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = brand.accentColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                  >
                    {cable.originalTitle}
                  </a>
                </h3>

                {/* Resumen Original del Diario */}
                <p
                  className="font-body"
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--ink-soft)',
                    lineHeight: 1.48,
                    margin: '0 0 16px 0',
                    flex: 1,
                  }}
                >
                  {cable.originalSummary}
                </p>

                {/* EL MARCO IRÓNICO ROSARINO */}
                <div
                  style={{
                    marginTop: 'auto',
                    padding: '12px 14px',
                    backgroundColor: 'var(--paper-elevated)',
                    borderLeft: '4px solid var(--red-urgent)',
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
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: 'var(--red-urgent)',
                        letterSpacing: '0.08em',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>⚡ RESEÑA EDITORIAL AL PASO</span>
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.62rem',
                        color: 'var(--ink-soft)',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      {cable.warningTag || 'OJO CRÍTICO'}
                    </span>
                  </div>

                  <p
                    style={{
                      fontFamily: 'var(--font-serif-body)',
                      fontStyle: 'italic',
                      fontSize: '0.94rem',
                      lineHeight: 1.4,
                      color: 'var(--ink)',
                      margin: '0 0 6px 0',
                    }}
                  >
                    &ldquo;{cable.ironicReview}&rdquo;
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.64rem',
                      color: 'var(--ink-soft)',
                      borderTop: '1px dashed var(--ink-faint)',
                      paddingTop: '4px',
                    }}
                  >
                    <span>* Nota original de {cable.source} no intervenida</span>
                    <span>Lectura directa sin filtros</span>
                  </div>
                </div>

                {/* Barra de Acciones: 1-Click Directo a la Nota Real */}
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
                      padding: '11px 14px',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      borderRadius: '3px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '2px 2px 0px var(--ink-soft)',
                      transition: 'transform 0.1s ease',
                    }}
                  >
                    <span>LEER EN {cable.source.toUpperCase()}</span>
                    <span>↗</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedCable(cable)}
                    title="Ver ficha editorial completa y claves"
                    style={{
                      padding: '11px 14px',
                      backgroundColor: 'var(--paper-elevated)',
                      color: 'var(--ink)',
                      border: '1px solid var(--ink)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      borderRadius: '3px',
                      cursor: 'pointer',
                      boxShadow: '2px 2px 0px var(--ink-soft)',
                    }}
                  >
                    🔍 CLAVES
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <section
      id="kiosco-mundial"
      style={{
        margin: '28px 0 48px 0',
        padding: '36px 28px',
        border: '3px solid var(--ink)',
        backgroundColor: 'var(--paper)',
        borderRadius: '4px',
        boxShadow: '6px 6px 0px var(--ink)',
        position: 'relative',
      }}
    >
      {/* Marco Editorial Superior del Kiosco */}
      <div
        style={{
          borderBottom: '2px solid var(--ink)',
          paddingBottom: '24px',
          marginBottom: '26px',
        }}
      >
        {/* Barra de metadatos */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                backgroundColor: 'var(--red-urgent)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '2px',
                letterSpacing: '0.09em',
              }}
            >
              PRENSA GLOBAL EN TIEMPO REAL
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--ink-soft)',
                letterSpacing: '0.04em',
              }}
            >
              ● NOTICIAS REALES DIRECTAS • EEUU • EUROPA • ASIA • RUSIA • ARGENTINA
            </span>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--ink)',
              fontWeight: 700,
              backgroundColor: 'var(--paper-elevated)',
              border: '1px solid var(--ink-faint)',
              padding: '4px 10px',
              borderRadius: '2px',
            }}
          >
            {filteredCables.length} NOTICIAS ACTIVAS
          </div>
        </div>

        {/* Título Principal y Manifiesto */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div style={{ flex: '1 1 540px' }}>
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                fontWeight: 900,
                color: 'var(--ink)',
                margin: '0 0 10px 0',
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
                textTransform: 'uppercase',
              }}
            >
              Los Mejores Diarios del Mundo & la Nación
            </h2>
            <p
              className="font-body"
              style={{
                fontSize: '1.12rem',
                lineHeight: 1.5,
                color: 'var(--ink-soft)',
                margin: 0,
                maxWidth: '780px',
              }}
            >
              Sin relleno ni simulaciones: entrá con <strong>un solo click a las noticias reales</strong> de <strong>EEUU</strong> (The New York Times, CNN), <strong>Europa</strong> (El País, BBC Mundo, DW, The Guardian), <strong>Asia</strong> (Al Jazeera), <strong>Rusia</strong> (RT, Sputnik) y <strong>Argentina</strong> (Clarín, La Nación, Infobae, Ámbito, La Capital).
              Cada despacho incluye una <strong>reseña editorial irónica al paso</strong> de nuestra redacción sin alterar ni una sola coma del texto original.
            </p>
          </div>

          {/* Buscador de noticias */}
          <div style={{ minWidth: '260px', flex: '1 1 280px', maxWidth: '380px' }}>
            <label
              htmlFor="kiosk-search-input"
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--ink-soft)',
                fontWeight: 700,
                marginBottom: '6px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Buscar en la Prensa Mundial
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="kiosk-search-input"
                type="text"
                placeholder="Titular, diario, país o ironía..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  backgroundColor: 'var(--paper-elevated)',
                  color: 'var(--ink)',
                  border: '2px solid var(--ink)',
                  borderRadius: '3px',
                  outline: 'none',
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--ink-soft)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Regiones Mundiales: EEUU, Europa, Asia, Rusia, Argentina */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '10px',
          marginBottom: '16px',
        }}
      >
        {SCOPES.map((scope) => {
          const isActive = activeScope === scope.key;
          return (
            <button
              key={scope.key}
              type="button"
              onClick={() => {
                setActiveScope(scope.key);
                setActiveSource('all');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: isActive ? 800 : 600,
                border: '2px solid var(--ink)',
                backgroundColor: isActive ? 'var(--ink)' : 'var(--paper-elevated)',
                color: isActive ? 'var(--paper)' : 'var(--ink)',
                borderRadius: '3px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '2px 2px 0px var(--red-urgent)' : 'none',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{scope.icon}</span>
              <span>{scope.label}</span>
            </button>
          );
        })}
      </div>

      {/* Selector de Diarios Específicos (Pills) */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '14px',
          marginBottom: '28px',
          borderBottom: '1px solid var(--ink-faint)',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveSource('all')}
          style={{
            padding: '5px 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            fontWeight: activeSource === 'all' ? 700 : 500,
            border: activeSource === 'all' ? '1px solid var(--red-urgent)' : '1px solid var(--ink-faint)',
            backgroundColor: activeSource === 'all' ? 'var(--red-urgent)' : 'var(--paper-elevated)',
            color: activeSource === 'all' ? '#FFFFFF' : 'var(--ink)',
            borderRadius: '2px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          TODOS LOS DIARIOS ({cables.length})
        </button>

        {availableSources.map((source) => {
          const brand = getBrandForSource(source);
          const isActive = activeSource.toLowerCase() === source.toLowerCase();
          return (
            <button
              key={source}
              type="button"
              onClick={() => setActiveSource(source)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                fontWeight: isActive ? 700 : 500,
                border: isActive ? '1px solid var(--ink)' : '1px solid var(--ink-faint)',
                backgroundColor: isActive ? 'var(--ink)' : 'var(--paper-elevated)',
                color: isActive ? 'var(--paper)' : 'var(--ink)',
                borderRadius: '2px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.12s ease',
              }}
            >
              <span>{brand.flag}</span>
              <span>{source}</span>
            </button>
          );
        })}
      </div>

      {/* Grilla Principal de Diarios */}
      {kioskGridContent}

      {/* Modal / Ficha Editorial Ampliada & Verificación 1-Click */}
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
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
            backdropFilter: 'blur(4px)',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSelectedCable(null);
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--paper)',
              border: '3px solid var(--ink)',
              borderRadius: '4px',
              maxWidth: '680px',
              width: '100%',
              padding: '28px',
              boxShadow: '8px 8px 0px var(--ink)',
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
                top: '14px',
                right: '14px',
                background: 'none',
                border: 'none',
                fontSize: '1.4rem',
                cursor: 'pointer',
                color: 'var(--ink)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--red-urgent)',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                FICHA DE COTEJO EDITORIAL
              </span>
              <span style={{ color: 'var(--ink-soft)', fontSize: '0.75rem' }}>•</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--ink-soft)',
                }}
              >
                {selectedCable.source}
              </span>
            </div>

            <h3
              className="font-display"
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                lineHeight: 1.25,
                margin: '0 0 18px 0',
                color: 'var(--ink)',
              }}
            >
              {selectedCable.originalTitle}
            </h3>

            <div
              style={{
                backgroundColor: 'var(--paper-elevated)',
                padding: '16px',
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
                  fontWeight: 700,
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                📰 TEXTO ORIGINAL EN {selectedCable.source.toUpperCase()}:
              </span>
              <p
                className="font-body"
                style={{ fontSize: '1rem', lineHeight: 1.5, margin: 0, color: 'var(--ink)' }}
              >
                {selectedCable.originalSummary}
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'var(--paper-elevated)',
                padding: '16px',
                borderLeft: '4px solid var(--red-urgent)',
                border: '1px solid var(--ink-faint)',
                borderRadius: '3px',
                marginBottom: '24px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--red-urgent)',
                  fontWeight: 800,
                  display: 'block',
                  marginBottom: '6px',
                  letterSpacing: '0.06em',
                }}
              >
                ⚡ {selectedCable.warningTag || 'RESEÑA EDITORIAL AL PASO'}
              </span>
              <p
                className="font-display"
                style={{
                  fontSize: '1.15rem',
                  fontStyle: 'italic',
                  lineHeight: 1.4,
                  margin: 0,
                  color: 'var(--ink)',
                }}
              >
                &ldquo;{selectedCable.ironicReview}&rdquo;
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setSelectedCable(null)}
                style={{
                  padding: '10px 18px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--ink-faint)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  borderRadius: '3px',
                  color: 'var(--ink)',
                }}
              >
                Volver al Kiosco
              </button>
              <a
                href={selectedCable.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 22px',
                  backgroundColor: 'var(--ink)',
                  color: 'var(--paper)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  borderRadius: '3px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '2px 2px 0px var(--red-urgent)',
                }}
              >
                <span>ABRIR NOTICIA ORIGINAL EN {selectedCable.source.toUpperCase()}</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
