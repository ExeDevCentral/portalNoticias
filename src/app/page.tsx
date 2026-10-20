'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HeroOrbital, { DEFAULT_STORIES, NewsStory } from '../components/HeroOrbital';
import { IconSun, IconMoon, IconArrowRight } from '../components/Icons';
import BreakingTicker from '../components/BreakingTicker';
import LiveFeedWire from '../components/LiveFeedWire';
import CategoryBlock from '../components/CategoryBlock';
import WorldKiosk from '../components/WorldKiosk';
import Footer from '../components/Footer';
import { NewsItem } from '../db/schema';

type SectionKey = 'portada' | 'kiosco' | 'futbol' | 'seguridad' | 'economia';

const NAV_ITEMS: { key: SectionKey; label: string; href: string }[] = [
  { key: 'portada', label: 'Portada 3D', href: '#portada-3d' },
  { key: 'kiosco', label: '🌍 Gran Kiosco', href: '#kiosco-mundial' },
  { key: 'futbol', label: "Fútbol: Newell's / Central", href: '#seccion-futbol' },
  { key: 'seguridad', label: 'Seguridad & Ciudad', href: '#seccion-seguridad' },
  { key: 'economia', label: 'Economía & Puerto', href: '#seccion-economia' },
];

export default function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [liveNews, setLiveNews] = useState<NewsItem[]>([]);
  const [urgentNews, setUrgentNews] = useState<{ id: string; title: string; slug?: string }[]>([]);
  const [categoryNews, setCategoryNews] = useState<{
    deportes: NewsItem[];
    seguridad: NewsItem[];
    economia: NewsItem[];
  }>({ deportes: [], seguridad: [], economia: [] });

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.dataset.theme = saved;
    } else {
      document.documentElement.dataset.theme = 'dark';
    }

    fetch('/api/news')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          if (res.data.feed) setLiveNews(res.data.feed);
          if (res.data.urgent) setUrgentNews(res.data.urgent);
          if (res.data.byCategory) {
            setCategoryNews({
              deportes: res.data.byCategory.deportes || [],
              seguridad: res.data.byCategory.seguridad || [],
              economia: res.data.byCategory.economia || [],
            });
          }
        }
      })
      .catch((err) => console.error('Error fetching live news:', err));
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.dataset.theme = next;
  };

  // Derivar las 5 historias con gancho real a partir de liveNews o DEFAULT_STORIES
  const orbitalStories = React.useMemo<NewsStory[]>(() => {
    if (!liveNews || liveNews.length === 0) return DEFAULT_STORIES;

    const rioItem = liveNews.find((n) => n.isPinned || n.category === 'ciudad' || n.category === 'sociedad');
    const segItem = liveNews.find((n) => n.category === 'seguridad');
    const futItem = liveNews.find((n) => n.category === 'deportes');
    const ecoItem = liveNews.find((n) => n.category === 'economia');
    const cultItem = liveNews.find((n) => (n.category === 'ciudad' || n.category === 'sociedad') && n.id !== rioItem?.id);

    return [
      rioItem
        ? {
            id: 'rio-principal',
            slug: rioItem.slug,
            category: rioItem.category === 'ciudad' ? 'CIUDAD & REGIÓN' : 'SOCIEDAD & MUNDO',
            tag: rioItem.isPinned ? 'PORTADA PRINCIPAL' : 'ACTUALIDAD',
            title: rioItem.title,
            summary: rioItem.summary,
            hook: rioItem.summary || rioItem.title,
            keyFacts: [rioItem.source, rioItem.category.toUpperCase(), 'Cobertura en tiempo real'],
            time: 'En vivo',
            readingTime: '3 min',
            source: rioItem.source,
            sourceUrl: rioItem.sourceUrl,
            imageUrl: rioItem.imageUrl || DEFAULT_STORIES[0].imageUrl,
            accentColor: 'var(--blue-parana)',
            isBreaking: rioItem.isUrgent || rioItem.isPinned,
          }
        : DEFAULT_STORIES[0],
      segItem
        ? {
            id: 'seguridad-ciudadana',
            slug: segItem.slug,
            category: 'SEGURIDAD & POLICIALES',
            tag: segItem.isUrgent ? 'URGENTE' : 'SEGURIDAD',
            title: segItem.title,
            summary: segItem.summary,
            hook: segItem.summary || segItem.title,
            keyFacts: [segItem.source, 'OPERATIVOS & JUSTICIA', 'Reporte verificado'],
            time: 'En vivo',
            readingTime: '3 min',
            source: segItem.source,
            sourceUrl: segItem.sourceUrl,
            imageUrl: segItem.imageUrl || DEFAULT_STORIES[1].imageUrl,
            accentColor: 'var(--red-urgent)',
            isBreaking: true,
          }
        : DEFAULT_STORIES[1],
      futItem
        ? {
            id: 'deportes-futbol',
            slug: futItem.slug,
            category: 'DEPORTES & FÚTBOL',
            tag: 'LIGA & PASIÓN',
            title: futItem.title,
            summary: futItem.summary,
            hook: futItem.summary || futItem.title,
            keyFacts: [futItem.source, 'DEPORTES', 'Cobertura de la fecha'],
            time: 'En vivo',
            readingTime: '2 min',
            source: futItem.source,
            sourceUrl: futItem.sourceUrl,
            imageUrl: futItem.imageUrl || DEFAULT_STORIES[2].imageUrl,
            accentColor: 'var(--amber-alert)',
            isBreaking: futItem.isUrgent,
          }
        : DEFAULT_STORIES[2],
      ecoItem
        ? {
            id: 'economia-puerto',
            slug: ecoItem.slug,
            category: 'ECONOMÍA & FINANZAS',
            tag: 'MERCADOS & PUERTO',
            title: ecoItem.title,
            summary: ecoItem.summary,
            hook: ecoItem.summary || ecoItem.title,
            keyFacts: [ecoItem.source, 'FINANZAS & COMERCIO', 'Actualización de cotizaciones'],
            time: 'En vivo',
            readingTime: '4 min',
            source: ecoItem.source,
            sourceUrl: ecoItem.sourceUrl,
            imageUrl: ecoItem.imageUrl || DEFAULT_STORIES[3].imageUrl,
            accentColor: 'var(--blue-parana)',
          }
        : DEFAULT_STORIES[3],
      cultItem
        ? {
            id: 'cultura-mundo',
            slug: cultItem.slug,
            category: 'MUNDO & SOCIEDAD',
            tag: 'GLOBAL & CULTURA',
            title: cultItem.title,
            summary: cultItem.summary,
            hook: cultItem.summary || cultItem.title,
            keyFacts: [cultItem.source, 'CULTURA & SOCIEDAD', 'Despacho internacional'],
            time: 'En vivo',
            readingTime: '3 min',
            source: cultItem.source,
            sourceUrl: cultItem.sourceUrl,
            imageUrl: cultItem.imageUrl || DEFAULT_STORIES[4].imageUrl,
            accentColor: '#8B5CF6',
          }
        : DEFAULT_STORIES[4],
    ];
  }, [liveNews]);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Barra superior de servicio y metadatos */}
      <div style={{ borderBottom: '1px solid var(--ink-faint)', padding: '6px 0', fontSize: '0.8rem', backgroundColor: 'var(--paper-elevated)' }}>
        <div className="editorial-container font-mono" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--ink-soft)' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: 'var(--ink)' }}>ROSARIO, SANTA FE</span>
            <span>•</span>
            <span>EDICIÓN CONTINUA 24HS</span>
            <span>•</span>
            <span style={{ color: 'var(--blue-parana)', fontWeight: 600 }}>RÍO PARANÁ: 3.42M (CRECIENDO)</span>
            <span>•</span>
            <span>DÓLAR: $1.240 / $1.260</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>CLIMA: 22°C (VIENTO DEL RÍO)</span>
            <button
              type="button"
              onClick={toggleTheme}
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
              {theme === 'dark' ? (
                <>
                  <IconSun size={12} style={{ color: 'var(--marker-yellow)' }} />
                  <span>MODO DÍA</span>
                </>
              ) : (
                <>
                  <IconMoon size={12} style={{ color: 'var(--blue-parana)' }} />
                  <span>MODO NOCTURNO</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {urgentNews.length > 0 && <BreakingTicker items={urgentNews} />}

      <div className="editorial-container">
        {/* Cabecera Principal del Periódico */}
        <header style={{ textAlign: 'center', padding: '24px 0 12px 0' }}>
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
              PAGO DE LOS ARROYOS & HISTORIA VIVA
            </span>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--red-urgent)', fontWeight: 'bold' }}>
              ● CABLES EN DIRECTO
            </span>
          </div>

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

          {/* Barra de Navegación Interactiva del Diario */}
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
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  style={{
                    textDecoration: 'none',
                    padding: '6px 0',
                    color: 'var(--ink)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    fontWeight: item.key === 'kiosco' ? 800 : 600,
                    textTransform: 'uppercase',
                    transition: 'all 0.2s ease',
                    borderBottom: item.key === 'kiosco' ? '2px solid var(--red-urgent)' : '2px solid transparent',
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link
                href="/redaccion"
                style={{
                  backgroundColor: 'var(--red-urgent)',
                  color: '#FFFFFF',
                  padding: '6px 14px',
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
                <IconArrowRight size={13} />
              </Link>
            </div>
          </nav>

          <div className="rule-single" />
        </header>
      </div>

      {/* SECCIÓN HERO ORBITAL 3D CON MICROANIMACIONES Y PARALLAX */}
      <div id="portada-3d">
        <HeroOrbital
          stories={orbitalStories}
          selectedIndex={activeStoryIndex}
          onStoryChange={setActiveStoryIndex}
        />
      </div>

      <div className="editorial-container" style={{ marginTop: '28px' }}>
        {/* EL GRAN KIOSCO DE DIARIOS DEL MUNDO & LA NACIÓN - ELEMENTO PRINCIPAL */}
        <WorldKiosk />

        <div className="rule-double" style={{ margin: '36px 0' }} />

        {/* ESTRUCTURA EDITORIAL EN DOS COLUMNAS: SECCIONES TEMÁTICAS + TERMINAL EN VIVO */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'start',
          }}
        >
          {/* Columna Izquierda: Bloques Temáticos Principales de Rosario */}
          <main style={{ gridColumn: 'span 2' }}>
            <div id="seccion-futbol">
              {categoryNews.deportes.length > 0 ? (
                <CategoryBlock
                  title="Fútbol Rosarino: Newell's y Central"
                  categoryKey="deportes"
                  items={categoryNews.deportes}
                />
              ) : null}
            </div>

            <div id="seccion-seguridad">
              {categoryNews.seguridad.length > 0 ? (
                <CategoryBlock
                  title="Seguridad Ciudadana & Monitoreo"
                  categoryKey="seguridad"
                  items={categoryNews.seguridad}
                />
              ) : null}
            </div>

            <div id="seccion-economia">
              {categoryNews.economia.length > 0 ? (
                <CategoryBlock
                  title="Economía, Puerto & Hidrovía"
                  categoryKey="economia"
                  items={categoryNews.economia}
                />
              ) : null}
            </div>
          </main>

          {/* Columna Derecha: Teletipo y Despachos en Vivo */}
          <aside style={{ borderLeft: '1px solid var(--ink-faint)', paddingLeft: '24px' }}>
            <LiveFeedWire initialItems={liveNews} />
          </aside>
        </div>

        <Footer />
      </div>
    </div>
  );
}
