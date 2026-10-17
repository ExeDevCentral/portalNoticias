'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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

interface NewsStory {
  id: string;
  category: string;
  tag: string;
  title: string;
  summary: string;
  time: string;
  readingTime: string;
  source: string;
  imageUrl: string;
  accentColor: string;
  isBreaking?: boolean;
}

const STORIES: NewsStory[] = [
  {
    id: 'costanera-parana',
    category: 'INFRAESTRUCTURA & RÍO',
    tag: 'OBRA HISTÓRICA',
    title: 'Megaplan Costanera 2026: Transforman la ribera del Paraná en el mayor parque público del país',
    summary: 'Se licitan 14 kilómetros continuos de paseo ribereño, ciclovías sustentables y renovación de antiguos galpones portuarios con financiamiento mixto.',
    time: 'Hace 4 min',
    readingTime: '3 min',
    source: 'Redacción Central',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'var(--blue-parana)',
    isBreaking: true,
  },
  {
    id: 'seguridad-circunvalacion',
    category: 'SEGURIDAD CIUDADANA',
    tag: 'OPERATIVO METROPOLITANO',
    title: 'Anillo digital inteligente y 180 domos con IA blindan todos los accesos a Circunvalación',
    summary: 'El nuevo centro de monitoreo metropolitano incorpora reconocimiento biométrico en tiempo real y patrullajes preventivos coordinados.',
    time: 'Hace 11 min',
    readingTime: '4 min',
    source: 'La Capital / Seguridad',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'var(--red-urgent)',
    isBreaking: true,
  },
  {
    id: 'clasico-rosarino',
    category: 'CLÁSICO ROSARINO',
    tag: 'PASIÓN DE LA CIUDAD',
    title: 'Semana de Clásico: Newell\'s y Rosario Central afinan planteles para una cita decisiva',
    summary: 'Ambos clubes entrenan a puertas cerradas. El Parque y Arroyito agotan localidades mientras Rosario late al ritmo de la máxima fiesta deportiva.',
    time: 'Hace 18 min',
    readingTime: '2 min',
    source: 'Rosario3 Deportes',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'var(--amber-alert)',
  },
  {
    id: 'hidrovia-puerto',
    category: 'ECONOMÍA & PUERTO',
    tag: 'RÉCORD AGROINDUSTRIAL',
    title: 'Terminales portuarias del Gran Rosario alcanzan el mayor movimiento de buques de la década',
    summary: 'La profundización de la Hidrovía Paraná-Paraguay y la cosecha de granos récord disparan las exportaciones en el cordón industrial santafesino.',
    time: 'Hace 32 min',
    readingTime: '5 min',
    source: 'Bolsa de Comercio',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80',
    accentColor: 'var(--blue-parana)',
  },
  {
    id: 'cultura-pichincha',
    category: 'CULTURA & VANGUARDIA',
    tag: 'CIRCUITO NOCTURNO',
    title: 'La Noche de las Galerías en Pichincha y el Bajo convoca a miles de jóvenes frente al río',
    summary: 'Más de 40 talleres de artistas, centros culturales y polos gastronómicos abren simultáneamente con intervenciones lumínicas y música en vivo.',
    time: 'Hace 45 min',
    readingTime: '3 min',
    source: 'Cultura Rosario',
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

function getKenBurnsClass(storyId: string): string {
  switch (storyId) {
    case 'costanera-parana':
      return 'animate-kenburns-river';
    case 'seguridad-circunvalacion':
      return 'animate-kenburns-traffic';
    case 'clasico-rosarino':
      return 'animate-kenburns-stadium';
    case 'hidrovia-puerto':
      return 'animate-kenburns-port';
    case 'cultura-pichincha':
      return 'animate-kenburns-culture';
    default:
      return 'animate-kenburns-river';
  }
}

export default function HeroOrbital() {
  const [activeIndex, setActiveIndex] = useState(0);
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
      setActiveIndex((prev) => (prev + 1) % STORIES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered]);

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
    setActiveIndex((prev) => (prev + 1) % STORIES.length);
  };

  const prevStory = () => {
    setActiveIndex((prev) => (prev - 1 + STORIES.length) % STORIES.length);
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
              PORTADA INTERACTIVA 3D
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
            <button
              type="button"
              onClick={() => setFanSpread((s) => (s > 1.1 ? 0.85 : 1.3))}
              title="Alternar apertura del abanico 3D"
              style={{
                background: 'var(--paper-elevated)',
                border: '1px solid var(--ink-faint)',
                padding: '5px 12px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--ink)',
                cursor: 'pointer',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              {fanSpread > 1.1 ? (
                <>
                  <IconDeckCollapse size={13} style={{ color: 'var(--ink-soft)' }} />
                  <span>COMPACTAR</span>
                </>
              ) : (
                <>
                  <IconDeckExpand size={13} style={{ color: 'var(--ink-soft)' }} />
                  <span>DESPLEGAR</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsAutoPlaying((p) => !p)}
              style={{
                background: 'var(--paper-elevated)',
                border: '1px solid var(--ink-faint)',
                padding: '5px 12px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--ink)',
                cursor: 'pointer',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
                letterSpacing: '0.04em',
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
            height: '490px',
            margin: '0 auto',
            maxWidth: '1100px',
            transform: `rotateY(${mousePos.x * 14}deg) rotateX(${-mousePos.y * 9}deg)`,
            transition: 'transform 0.12s ease-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {STORIES.map((story, index) => {
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
              <button
                type="button"
                key={story.id}
                onClick={() => setActiveIndex(index)}
                className={`orbital-card shimmer-effect preserve-3d absolute rounded-xl cursor-pointer ${
                  isCenter ? 'animate-orbital-float' : ''
                }`}
                style={{
                  width: 'min(90vw, 460px)',
                  height: '450px',
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
                }}
              >
                {/* 1. Header Imagen con Cinemagraph & Foto Viva */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '210px',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className={getKenBurnsClass(story.id)}
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
                      {/* Destellos de flashes en las tribunas */}
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
                        gap: '8px',
                        marginBottom: '6px',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        color: story.accentColor,
                        fontWeight: 700,
                      }}
                    >
                      <span>{story.category}</span>
                      <span style={{ color: 'var(--ink-soft)' }}>•</span>
                      <span style={{ color: 'var(--ink-soft)' }}>{story.source}</span>
                    </div>

                    <h3
                      className="font-display"
                      style={{
                        fontSize: isCenter ? '1.2rem' : '1.05rem',
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

                    {isCenter && (
                      <p
                        style={{
                          fontSize: '0.84rem',
                          color: 'var(--ink-soft)',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {story.summary}
                      </p>
                    )}
                  </div>

                  {/* Footer de la Card */}
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
                    <span
                      style={{
                        color: story.accentColor,
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        letterSpacing: '0.04em',
                      }}
                    >
                      <span>LEER NOTICIA</span>
                      <IconArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </button>
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
            {STORIES.map((story, i) => (
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
