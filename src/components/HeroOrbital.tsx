'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  IconDeckExpand,
  IconDeckCollapse,
  IconPlay,
  IconPause,
  IconRadar,
  IconClock,
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
} from './Icons';

export interface NewsStory {
  id: string;
  slug: string;
  category: string;
  tag: string;
  title: string;
  summary: string;
  hook: string;
  keyFacts?: string[];
  time: string;
  readingTime: string;
  source: string;
  sourceUrl?: string;
  imageUrl: string;
  accentColor: string;
  isBreaking?: boolean;
}

export const DEFAULT_STORIES: NewsStory[] = [
  {
    id: 'costanera-parana',
    slug: 'obras-restauracion-monumento-nacional-a-la-bandera',
    category: 'INFRAESTRUCTURA & RÍO',
    tag: 'OBRA HISTÓRICA',
    title: 'Finalizan las obras históricas en el Monumento y la ribera: reabren la cripta y el paseo frente al Paraná',
    summary: 'Tras una intervención integral de ingeniería patrimonial, se habilitan la cripta, el propileo y el circuito costero con nueva iluminación nocturna.',
    hook: 'Tras 8 años de andamios y promesas postergadas, Rosario recupera su mayor balcón fluvial con acceso público libre y vista panorámica a la Hidrovía.',
    keyFacts: ['Mirador nocturno habilitado', 'Esculturas de Lola Mora restauradas', 'Paseo costero integrado'],
    time: 'Hace 4 min',
    readingTime: '3 min',
    source: 'La Capital',
    sourceUrl: 'https://www.lacapital.com.ar/la-ciudad/finalizaron-obras-monumento-bandera.html',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'var(--blue-parana)',
    isBreaking: true,
  },
  {
    id: 'seguridad-circunvalacion',
    slug: 'operativo-seguridad-circunvalacion-autopista-santa-fe-niebla',
    category: 'SEGURIDAD CIUDADANA',
    tag: 'OPERATIVO METROPOLITANO',
    title: 'Anillo digital inteligente y 180 domos con IA blindan todos los accesos a Circunvalación',
    summary: 'El nuevo centro de monitoreo metropolitano incorpora reconocimiento automático de patentes y patrullajes preventivos coordinados en tiempo real.',
    hook: 'Algoritmos de visión computarizada escanean cada vehículo al ingresar por autopistas y despachan alertas a móviles en menos de 90 segundos.',
    keyFacts: ['180 domos 4K activos', 'Lectura de patentes en 3ms', 'Monitoreo 24hs coordinado'],
    time: 'Hace 11 min',
    readingTime: '4 min',
    source: 'Rosario3 / Seguridad',
    sourceUrl: 'https://www.rosario3.com/policiales/operativo-circunvalacion-niebla.html',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'var(--red-urgent)',
    isBreaking: true,
  },
  {
    id: 'clasico-rosarino',
    slug: 'rosario-central-gigante-arroyito-socios-agotaron-plateas',
    category: 'CLÁSICO ROSARINO',
    tag: 'PASIÓN DE LA CIUDAD',
    title: "Semana de Clásico: Central colma el Gigante y Newell's afina la táctica en Bella Vista",
    summary: '45.000 socios auriazules agotaron las ubicaciones en tiempo récord mientras el rojinegro define su alineación titular a puertas cerradas.',
    hook: 'La ciudad paraliza su pulso cotidiano: entradas agotadas en 40 minutos y operativo con 1.100 efectivos para una cita que no admite tibiezas.',
    keyFacts: ['Gigante de Arroyito repleto', 'Dupla goleadora de la Lepra lista', 'Seguridad con 1.100 efectivos'],
    time: 'Hace 18 min',
    readingTime: '2 min',
    source: 'Rosario3 Deportes',
    sourceUrl: 'https://www.lacapital.com.ar/ovacion/central-entradas-arroyito.html',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'var(--amber-alert)',
    isBreaking: true,
  },
  {
    id: 'hidrovia-puerto',
    slug: 'puerto-san-lorenzo-timbues-embarque-record-granos',
    category: 'ECONOMÍA & PUERTO',
    tag: 'RÉCORD AGROINDUSTRIAL',
    title: 'Terminales portuarias del Gran Rosario alcanzan el mayor movimiento de buques de la década',
    summary: 'La profundización de la Hidrovía Paraná-Paraguay y la cosecha récord disparan las exportaciones con más de doce millones de toneladas despachadas.',
    hook: 'Por el Paraná marrón sale el 80% de los granos del país, generando más divisas que toda la City porteña con 80 buques en rada.',
    keyFacts: ['12M de toneladas despachadas', 'Calado a 34 pies garantizado', 'Récord histórico de divisas'],
    time: 'Hace 32 min',
    readingTime: '5 min',
    source: 'Bolsa de Comercio',
    sourceUrl: 'https://www.bcr.com.ar/noticias/puertos-record-granos.html',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'var(--blue-parana)',
  },
  {
    id: 'cultura-pichincha',
    slug: 'noche-galerias-pichincha-circuito-nocturno',
    category: 'CULTURA & VANGUARDIA',
    tag: 'CIRCUITO NOCTURNO',
    title: 'La Noche de las Galerías en Pichincha y el Bajo convoca a miles de jóvenes frente al río',
    summary: 'Más de 40 talleres de artistas, centros culturales y polos gastronómicos abren simultáneamente con intervenciones lumínicas y música en vivo.',
    hook: 'De prostíbulos de 1900 a polo de diseño independiente: el barrio festeja con arte en las veredas, cerveza artesanal y carlitos al paso.',
    keyFacts: ['40 talleres de artistas abiertos', 'Intervenciones lumínicas', 'Circuito peatonal protegido'],
    time: 'Hace 45 min',
    readingTime: '3 min',
    source: 'Cultura Rosario',
    sourceUrl: 'https://www.rosario.gob.ar/cultura/noche-galerias-pichincha.html',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#8B5CF6',
  },
];

const LIVE_TICKERS = [
  '[ALERTA] Habilitan nueva dársena en Puente Rosario-Victoria sin demoras de tránsito',
  '[HIDROVÍA] Altura del Río Paraná frente a Rosario en 3.42m (Creciendo 4cm / hora)',
  '[LIGA PROFESIONAL] Seguridad coordina operativo con 1.100 efectivos para el clásico rosarino',
  '[MERCADOS] Dólar en Rosario: Compra $1.240 | Venta $1.260 — Operatoria en calma',
  '[METEOROLOGÍA] Cielo despejado, 22°C con brisa fresca del río Paraná',
];

function getKenBurnsClass(storyId: string, category?: string): string {
  if (storyId === 'costanera-parana' || category?.toLowerCase().includes('rio') || category?.toLowerCase().includes('ciudad')) {
    return 'animate-kenburns-river';
  }
  if (storyId === 'seguridad-circunvalacion' || category?.toLowerCase().includes('seguridad')) {
    return 'animate-kenburns-traffic';
  }
  if (storyId === 'clasico-rosarino' || category?.toLowerCase().includes('deporte') || category?.toLowerCase().includes('futbol')) {
    return 'animate-kenburns-stadium';
  }
  if (storyId === 'hidrovia-puerto' || category?.toLowerCase().includes('puerto') || category?.toLowerCase().includes('economia')) {
    return 'animate-kenburns-port';
  }
  if (storyId === 'cultura-pichincha' || category?.toLowerCase().includes('cultura')) {
    return 'animate-kenburns-culture';
  }
  return 'animate-kenburns-river';
}

interface HeroOrbitalProps {
  selectedIndex?: number;
  onStoryChange?: (index: number) => void;
  stories?: NewsStory[];
}

export default function HeroOrbital({
  selectedIndex,
  onStoryChange,
  stories: incomingStories,
}: Readonly<HeroOrbitalProps>) {
  const stories = incomingStories && incomingStories.length > 0 ? incomingStories : DEFAULT_STORIES;
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = selectedIndex ?? internalIndex;

  const setActiveIndex = useCallback(
    (newIndex: number | ((prev: number) => number)) => {
      const resolved = typeof newIndex === 'function' ? newIndex(activeIndex) : newIndex;
      setInternalIndex(resolved);
      if (onStoryChange) {
        onStoryChange(resolved);
      }
    },
    [activeIndex, onStoryChange]
  );

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetMousePos, setTargetMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [fanSpread, setFanSpread] = useState(1); // 1 = normal, 1.4 = abierto, 0.7 = compacto
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Parallax por scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Interpolación suave del movimiento del mouse (Spring feel)
  useEffect(() => {
    const updatePhysics = () => {
      setMousePos((prev) => {
        const factor = isHovered ? 0.08 : 0.04;
        const dx = targetMousePos.x - prev.x;
        const dy = targetMousePos.y - prev.y;
        return {
          x: prev.x + dx * factor,
          y: prev.y + dy * factor,
        };
      });
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetMousePos, isHovered]);

  // Rotación automática cuando no se interactúa activamente
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stories.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, setActiveIndex, stories.length]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // De -1 a +1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // De -1 a +1

    setTargetMousePos({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setFanSpread(1.25); // Al entrar el mouse el abanico se abre
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTargetMousePos({ x: 0, y: 0 });
    setFanSpread(1.0); // Al salir vuelve al estado equilibrado
  };

  const nextStory = () => {
    setActiveIndex((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden perspective-stage select-none"
      style={{
        paddingTop: '20px',
        paddingBottom: '36px',
        background: `radial-gradient(circle at ${((mousePos.x + 1) / 2) * 100}% ${((mousePos.y + 1) / 2) * 100}%, var(--hero-glow-1) 0%, var(--hero-glow-2) 35%, transparent 70%)`,
        borderBottom: '1px solid var(--ink-faint)',
      }}
    >
      {/* 1. Fondo de Parallax con Tipografía Gigante */}
      <div
        className="font-display font-black tracking-tighter uppercase"
        style={{
          position: 'absolute',
          top: '18%',
          left: '50%',
          transform: `translate(-50%, ${scrollY * 0.22}px) rotate(${mousePos.x * 1.5}deg)`,
          fontSize: 'clamp(3.5rem, 11vw, 10rem)',
          lineHeight: 0.85,
          color: 'var(--hero-bg-text)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'transform 0.1s linear',
        }}
      >
        ROSARIO EN TIEMPO REAL
      </div>

      <div className="editorial-container relative z-10">
        {/* Barra superior de métricas del Hero y Control de Órbita */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-mono)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Badge En Vivo & Fuente */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              className="animate-live-pulse"
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--red-urgent)',
              }}
            />
            <span style={{ fontWeight: 700, letterSpacing: '0.08em', color: 'var(--red-urgent)' }}>
              PORTADA INTERACTIVA 3D • NOTICIAS REALES
            </span>
            <span style={{ color: 'var(--ink-soft)' }}>•</span>
            <span style={{ color: 'var(--ink-soft)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              {isHovered ? (
                <>
                  <IconRadar size={13} style={{ color: 'var(--red-urgent)' }} />
                  <span>SEGUIMIENTO ACTIVO</span>
                </>
              ) : (
                <span>ÓRBITA AUTOMÁTICA</span>
              )}
            </span>
          </div>

          {/* Controles de Vista y Abanico */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Control de Abanico 3D */}
            <div
              style={{
                display: 'flex',
                background: 'var(--paper-elevated)',
                border: '1px solid var(--ink-faint)',
                borderRadius: '4px',
                padding: '2px',
                gap: '2px',
              }}
            >
              <button
                type="button"
                onClick={() => setFanSpread(0.75)}
                title="Vista Compacta"
                style={{
                  background: fanSpread === 0.75 ? 'var(--ink)' : 'transparent',
                  color: fanSpread === 0.75 ? 'var(--paper)' : 'var(--ink-soft)',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '3px',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  fontWeight: fanSpread === 0.75 ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <IconDeckCollapse size={12} />
                <span>ENFOCAR</span>
              </button>
              <button
                type="button"
                onClick={() => setFanSpread(1.0)}
                title="Vista Equilibrada"
                style={{
                  background: fanSpread === 1.0 ? 'var(--ink)' : 'transparent',
                  color: fanSpread === 1.0 ? 'var(--paper)' : 'var(--ink-soft)',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '3px',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  fontWeight: fanSpread === 1.0 ? 700 : 500,
                }}
              >
                NORMAL
              </button>
              <button
                type="button"
                onClick={() => setFanSpread(1.35)}
                title="Vista Desplegada"
                style={{
                  background: fanSpread === 1.35 ? 'var(--ink)' : 'transparent',
                  color: fanSpread === 1.35 ? 'var(--paper)' : 'var(--ink-soft)',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '3px',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  fontWeight: fanSpread === 1.35 ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <IconDeckExpand size={12} />
                <span>ABANICO</span>
              </button>
            </div>

            {/* Play/Pause Rotación */}
            <button
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              style={{
                background: 'var(--paper-elevated)',
                border: '1px solid var(--ink-faint)',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                color: 'var(--ink)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 600,
              }}
            >
              {isAutoPlaying ? (
                <>
                  <IconPause size={11} style={{ color: 'var(--ink-soft)' }} />
                  <span>PAUSAR</span>
                </>
              ) : (
                <>
                  <IconPlay size={11} style={{ color: 'var(--ink-soft)' }} />
                  <span>REANUDAR</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. Escenario 3D Orbital con Perspectiva */}
        <div
          className="preserve-3d"
          style={{
            position: 'relative',
            height: '540px',
            margin: '0 auto',
            maxWidth: '1100px',
            transform: `rotateY(${mousePos.x * 14}deg) rotateX(${-mousePos.y * 9}deg)`,
            transition: 'transform 0.12s ease-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {stories.map((story, index) => {
            const delta = index - activeIndex;
            const isCenter = delta === 0;

            // Fórmulas físicas del abanico orbital 3D
            const spreadWidth = isHovered ? 295 * fanSpread : 255 * fanSpread;
            const translateX = delta * spreadWidth + mousePos.x * 24;
            const translateZ = -Math.abs(delta) * 125 + (isCenter ? 60 : 0) + (isHovered && isCenter ? 30 : 0);
            const rotateY = delta * -15 + mousePos.x * 9;
            const rotateZ = delta * 1.8 + mousePos.x * 1.2;
            const scale = isCenter ? 1.05 : Math.max(0.78, 1 - Math.abs(delta) * 0.12);
            const opacity = Math.abs(delta) > 2 ? 0.25 : 1 - Math.abs(delta) * 0.18;
            const zIndex = 20 - Math.abs(delta);

            return (
              <div
                key={story.id}
                role="region"
                aria-label={story.title}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(index);
                  }
                }}
                className={`orbital-card shimmer-effect preserve-3d absolute rounded-xl ${
                  isCenter ? 'animate-orbital-float' : 'cursor-pointer'
                }`}
                style={{
                  width: 'min(92vw, 470px)',
                  height: '515px',
                  position: 'absolute',
                  textAlign: 'left',
                  padding: 0,
                  fontFamily: 'inherit',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transformOrigin: 'bottom center',
                  borderRadius: '16px',
                  backgroundColor: 'var(--paper-card)',
                  border: isCenter
                    ? `2px solid ${story.accentColor}`
                    : '1px solid var(--ink-faint)',
                  overflow: 'hidden',
                  boxShadow: isCenter
                    ? `var(--card-shadow-center), 0 0 25px ${story.accentColor}33`
                    : 'var(--card-shadow-side)',
                  cursor: isCenter ? 'default' : 'pointer',
                }}
              >
                {/* 1. Header Imagen con Cinemagraph & Foto Viva */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: isCenter ? '195px' : '210px',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className={getKenBurnsClass(story.id, story.category)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.92) contrast(1.18)',
                    }}
                  />

                  {/* CAPAS VIVAS ESPECÍFICAS SEGÚN LA NOTICIA */}

                  {/* 1. Escena Costanera: Bruma y Ondas de Agua */}
                  {story.id === 'costanera-parana' && (
                    <>
                      <div
                        className="animate-water-glimmer"
                        style={{
                          position: 'absolute',
                          bottom: '10%',
                          left: '5%',
                          right: '5%',
                          height: '28%',
                          background:
                            'radial-gradient(ellipse at center, rgba(0, 150, 199, 0.35) 0%, rgba(255, 255, 255, 0.2) 40%, transparent 80%)',
                          mixBlendMode: 'screen',
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        className="animate-mist-drift"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)',
                          pointerEvents: 'none',
                        }}
                      />
                    </>
                  )}

                  {/* 2. Escena Seguridad: Haces de Luces de Tráfico & Escáner IA */}
                  {story.id === 'seguridad-circunvalacion' && (
                    <>
                      <div
                        className="animate-traffic-red-1"
                        style={{
                          position: 'absolute',
                          left: '32%',
                          top: 0,
                          width: '4px',
                          height: '80px',
                          background: 'linear-gradient(to top, rgba(230, 57, 70, 0.95), transparent)',
                          boxShadow: '0 0 12px #E63946',
                          borderRadius: '2px',
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        className="animate-traffic-red-2"
                        style={{
                          position: 'absolute',
                          left: '36%',
                          top: 0,
                          width: '3px',
                          height: '65px',
                          background: 'linear-gradient(to top, rgba(255, 74, 61, 0.9), transparent)',
                          boxShadow: '0 0 10px #FF4A3D',
                          borderRadius: '2px',
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        className="animate-traffic-white-1"
                        style={{
                          position: 'absolute',
                          right: '34%',
                          top: 0,
                          width: '4px',
                          height: '75px',
                          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95), transparent)',
                          boxShadow: '0 0 14px rgba(255, 255, 255, 0.9)',
                          borderRadius: '2px',
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        className="animate-radar-scan"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to bottom, transparent 0%, rgba(230, 57, 70, 0.18) 50%, transparent 100%)',
                          pointerEvents: 'none',
                        }}
                      />
                    </>
                  )}

                  {/* 3. Escena Clásico: Flashes de Cámaras & Reflectores en Estadio */}
                  {story.id === 'clasico-rosarino' && (
                    <>
                      <div
                        className="animate-flash-a"
                        style={{
                          position: 'absolute',
                          top: '28%',
                          left: '25%',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 0 20px 8px #FFFFFF, 0 0 35px 14px rgba(255, 225, 77, 0.7)',
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        className="animate-flash-b"
                        style={{
                          position: 'absolute',
                          top: '22%',
                          right: '30%',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 0 18px 7px #FFFFFF, 0 0 30px 12px rgba(255, 255, 255, 0.8)',
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        className="animate-flash-a"
                        style={{
                          position: 'absolute',
                          top: '35%',
                          right: '18%',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          boxShadow: '0 0 14px 6px #FFFFFF',
                          pointerEvents: 'none',
                          animationDelay: '1.7s',
                        }}
                      />
                      <div
                        className="animate-floodlight"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.16) 0%, transparent 60%)',
                          pointerEvents: 'none',
                        }}
                      />
                    </>
                  )}

                  {/* 4. Escena Puerto: Ondas de Agua & Oleaje */}
                  {story.id === 'hidrovia-puerto' && (
                    <div
                      className="animate-port-water"
                      style={{
                        position: 'absolute',
                        bottom: '8%',
                        left: '0',
                        right: '0',
                        height: '35%',
                        background:
                          'radial-gradient(ellipse at 50% 100%, rgba(0, 119, 182, 0.4) 0%, rgba(255, 255, 255, 0.15) 35%, transparent 75%)',
                        mixBlendMode: 'screen',
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  {/* 5. Escena Cultura: Neón Pulsante & Bokeh Nocturno */}
                  {story.id === 'cultura-pichincha' && (
                    <>
                      <div
                        className="animate-neon-glow"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'radial-gradient(circle at 65% 45%, rgba(139, 92, 246, 0.28) 0%, rgba(236, 72, 153, 0.18) 40%, transparent 70%)',
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        className="animate-bokeh-drift"
                        style={{
                          position: 'absolute',
                          top: '30%',
                          left: '40%',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.7) 0%, transparent 70%)',
                          filter: 'blur(3px)',
                          pointerEvents: 'none',
                        }}
                      />
                      <div
                        className="animate-bokeh-drift"
                        style={{
                          position: 'absolute',
                          bottom: '25%',
                          right: '25%',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, transparent 70%)',
                          filter: 'blur(4px)',
                          pointerEvents: 'none',
                          animationDelay: '2.5s',
                        }}
                      />
                    </>
                  )}

                  {/* Gradiente cinemático para máxima legibilidad */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'var(--card-img-overlay)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Badge de Cinemagraph / Foto Viva */}
                  {isCenter && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        zIndex: 5,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '3px',
                        padding: '2px 6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.62rem',
                        fontFamily: 'var(--font-mono)',
                        color: '#FFF',
                        letterSpacing: '0.05em',
                      }}
                    >
                      <span
                        className="animate-live-pulse"
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#10B981',
                        }}
                      />
                      <span>FOTO EN VIVO</span>
                    </div>
                  )}

                  {/* Badges Flotantes */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      right: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: story.accentColor,
                        color: '#FFFFFF',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.06em',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                      }}
                    >
                      {story.tag}
                    </span>
                    <span
                      className="glass-editorial font-mono"
                      style={{
                        fontSize: '0.68rem',
                        color: 'var(--ink)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: 600,
                      }}
                    >
                      {story.time}
                    </span>
                  </div>
                </div>

                {/* 2. Cuerpo Editorial de la Noticia */}
                {isCenter ? (
                  <div
                    style={{
                      flex: 1,
                      padding: '16px 20px 14px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--paper-card)',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '6px',
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: story.accentColor, fontWeight: 800 }}>{story.category}</span>
                          <span style={{ color: 'var(--ink-soft)' }}>•</span>
                          <span style={{ color: 'var(--ink-soft)' }}>{story.source}</span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            backgroundColor: `${story.accentColor}22`,
                            color: story.accentColor,
                            padding: '1px 6px',
                            borderRadius: '3px',
                            letterSpacing: '0.04em',
                          }}
                        >
                          NOTICIA REAL
                        </span>
                      </div>

                      <Link
                        href={`/noticia/${story.slug}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <h3
                          className="font-display"
                          style={{
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            lineHeight: 1.25,
                            color: 'var(--ink)',
                            marginBottom: '8px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            transition: 'color 0.2s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = story.accentColor)}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                        >
                          {story.title}
                        </h3>
                      </Link>

                      {/* CAJA DEL GANCHO EDITORIAL (HOOK PARA NOTICIA REAL) */}
                      <div
                        style={{
                          backgroundColor: 'var(--paper-elevated)',
                          borderLeft: `3px solid ${story.accentColor}`,
                          padding: '7px 11px',
                          borderRadius: '4px',
                          marginBottom: '8px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                        }}
                      >
                        <div
                          className="font-mono"
                          style={{
                            fontSize: '0.66rem',
                            fontWeight: 800,
                            color: story.accentColor,
                            letterSpacing: '0.06em',
                            marginBottom: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <span>⚡ EL GANCHO EDITORIAL</span>
                        </div>
                        <p
                          style={{
                            fontSize: '0.84rem',
                            color: 'var(--ink)',
                            lineHeight: 1.35,
                            margin: 0,
                            fontWeight: 500,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {story.hook}
                        </p>
                      </div>

                      {/* DATOS CLAVE (EN 30 SEGUNDOS) */}
                      {story.keyFacts && story.keyFacts.length > 0 && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          {story.keyFacts.map((fact, idx) => (
                            <span
                              key={idx}
                              className="font-mono"
                              style={{
                                fontSize: '0.64rem',
                                backgroundColor: 'var(--paper-soft)',
                                border: '1px solid var(--ink-faint)',
                                padding: '2px 7px',
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

                    {/* Footer de la Card con botón real */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '8px',
                        borderTop: '1px solid var(--ink-faint)',
                        fontSize: '0.74rem',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      <span style={{ color: 'var(--ink-soft)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <IconClock size={12} style={{ color: 'var(--ink-soft)' }} />
                        <span>{story.readingTime}</span>
                      </span>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {story.sourceUrl && (
                          <a
                            href={story.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Leer directamente en la fuente oficial (${story.source})`}
                            style={{
                              backgroundColor: 'transparent',
                              color: 'var(--ink)',
                              border: '1px solid var(--ink-faint)',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              textDecoration: 'none',
                              fontWeight: 700,
                              fontSize: '0.74rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <span>{story.source}</span>
                            <span>↗</span>
                          </a>
                        )}

                        <Link
                          href={`/noticia/${story.slug}`}
                          style={{
                            backgroundColor: story.accentColor,
                            color: '#FFFFFF',
                            padding: '6px 14px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: '0.76rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: `0 3px 12px ${story.accentColor}44`,
                            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = `0 5px 18px ${story.accentColor}66`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = `0 3px 12px ${story.accentColor}44`;
                          }}
                        >
                          <span>LEER COMPLETA</span>
                          <IconArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      flex: 1,
                      padding: '14px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--paper-card)',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '6px',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          color: story.accentColor,
                          fontWeight: 700,
                        }}
                      >
                        <span>{story.category}</span>
                      </div>

                      <h3
                        className="font-display"
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          lineHeight: 1.25,
                          color: 'var(--ink)',
                          marginBottom: '8px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {story.title}
                      </h3>

                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--ink-soft)',
                          lineHeight: 1.35,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          margin: 0,
                        }}
                      >
                        {story.summary}
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '6px',
                        borderTop: '1px solid var(--ink-faint)',
                        fontSize: '0.7rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--ink-soft)',
                      }}
                    >
                      <span>{story.source}</span>
                      <span
                        style={{
                          color: story.accentColor,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>ENFOCAR</span>
                        <IconArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 3. Indicadores de Navegación Orbital y Botones */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            marginTop: '16px',
            position: 'relative',
            zIndex: 30,
          }}
        >
          <button
            type="button"
            onClick={prevStory}
            aria-label="Historia anterior"
            style={{
              background: 'var(--paper-elevated)',
              border: '1px solid var(--ink-faint)',
              color: 'var(--ink)',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, background 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.12)';
              e.currentTarget.style.borderColor = 'var(--red-urgent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'var(--ink-faint)';
            }}
          >
            <IconChevronLeft size={16} />
          </button>

          {/* Dots Indicadores con micro-barra de progreso */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {stories.map((story, i) => (
              <button
                type="button"
                key={story.id}
                onClick={() => setActiveIndex(i)}
                aria-label={`Ir a noticia ${i + 1}`}
                style={{
                  width: activeIndex === i ? '34px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  backgroundColor:
                    activeIndex === i ? story.accentColor : 'var(--ink-faint)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow:
                    activeIndex === i ? `0 0 10px ${story.accentColor}88` : 'none',
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextStory}
            aria-label="Siguiente historia"
            style={{
              background: 'var(--paper-elevated)',
              border: '1px solid var(--ink-faint)',
              color: 'var(--ink)',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, background 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.12)';
              e.currentTarget.style.borderColor = 'var(--red-urgent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'var(--ink-faint)';
            }}
          >
            <IconChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 4. Ticker Continuo de Cables en Vivo (Infinito con Hover Pause) */}
      <div
        style={{
          marginTop: '28px',
          background: 'var(--paper-elevated)',
          borderTop: '1px solid var(--ink-faint)',
          borderBottom: '1px solid var(--ink-faint)',
          padding: '8px 0',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 10,
            backgroundColor: 'var(--red-urgent)',
            color: '#FFFFFF',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            boxShadow: '4px 0 12px rgba(0,0,0,0.3)',
          }}
        >
          CABLES 24HS
        </div>

        <div className="marquee-track" style={{ paddingLeft: '140px' }}>
          {[...LIVE_TICKERS, ...LIVE_TICKERS].map((cable, idx) => (
            <span
              key={`ticker-${idx}-${cable.slice(0, 15)}`}
              className="font-mono"
              style={{
                fontSize: '0.82rem',
                color: 'var(--ink)',
                marginRight: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{cable}</span>
              <span style={{ color: 'var(--red-urgent)', opacity: 0.6 }}>•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
