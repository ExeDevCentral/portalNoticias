'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NewsItem } from '../db/schema';
import { formatTimeAgo } from '../utils/formatters';

interface LiveFeedWireProps {
  initialItems: NewsItem[];
}

const SOURCE_COLORS: Record<string, string> = {
  'La Capital': '#1E40AF',
  'Rosario3': '#EA580C',
  'El Ciudadano': '#DC2626',
  'Infobae': '#F97316',
  'Clarín': '#EF4444',
  'Ámbito Financiero': '#3B82F6',
  'Prensa Federal': '#8B5CF6',
  'La Nación': '#8B5CF6',
};

export default function LiveFeedWire({ initialItems }: LiveFeedWireProps) {
  const [items, setItems] = useState<NewsItem[]>(initialItems);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('/api/live');

      eventSource.onopen = () => {
        setConnected(true);
      };

      eventSource.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          if (event.type === 'news_item' && event.payload) {
            const newItem = event.payload as NewsItem;
            setItems((prev) => [newItem, ...prev.slice(0, 24)]);
          } else if (event.type === 'alert' && event.payload) {
            const alertItem: NewsItem = {
              id: (event.payload.id as string) || String(Date.now()),
              title: event.payload.title as string,
              slug: (event.payload.slug as string) || '',
              summary: (event.payload.summary as string) || 'Despacho urgente emitido desde la Redacción.',
              content: '',
              imageUrl: '',
              source: 'Alerta Roja',
              sourceUrl: '',
              category: 'seguridad',
              isUrgent: true,
              isPinned: false,
              publishedAt: new Date(),
              createdAt: new Date(),
            };
            setItems((prev) => [alertItem, ...prev.slice(0, 24)]);
          }
        } catch (err) {
          console.error('Error processing SSE live message:', err);
        }
      };

      eventSource.onerror = () => {
        setConnected(false);
      };
    } catch (err) {
      console.error('Failed to connect to SSE /api/live:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: 'var(--paper-card)',
        border: '1px solid var(--ink-faint)',
        borderRadius: '10px',
        padding: '14px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          borderBottom: '1px solid var(--ink-faint)',
          paddingBottom: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: connected ? 'var(--red-urgent)' : 'var(--amber-alert)',
              boxShadow: `0 0 8px ${connected ? 'var(--red-urgent)' : 'var(--amber-alert)'}`,
            }}
          />
          <h3
            className="font-mono"
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: 0,
              color: 'var(--ink)',
            }}
          >
            CABLES EN VIVO
          </h3>
        </div>

        <span
          className="font-mono"
          style={{
            fontSize: '0.66rem',
            color: connected ? 'var(--red-urgent)' : 'var(--ink-soft)',
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}
        >
          {connected ? '● EN DIRECTO' : '○ RECONECTANDO'}
        </span>
      </div>

      {/* Contenedor con Scroll Compacto para que no alargue la página */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxHeight: '480px',
          overflowY: 'auto',
          paddingRight: '4px',
        }}
      >
        {items.map((item) => {
          const displaySource = item.source === 'La Nación' ? 'Prensa Federal' : item.source;
          const dotColor = SOURCE_COLORS[displaySource] || 'var(--ink-soft)';

          return (
            <div
              key={item.id}
              style={{
                borderBottom: '1px solid var(--ink-faint)',
                paddingBottom: '10px',
                animation: 'fadeIn 0.3s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '3px',
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.66rem',
                    color: 'var(--ink-soft)',
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
                      backgroundColor: dotColor,
                    }}
                  />
                  <strong style={{ color: 'var(--ink)' }}>{displaySource}</strong> •{' '}
                  {formatTimeAgo(item.publishedAt)}
                </span>
                {item.isUrgent && (
                  <span
                    style={{
                      backgroundColor: 'var(--red-urgent)',
                      color: '#FFF',
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      padding: '1px 4px',
                      borderRadius: '2px',
                    }}
                  >
                    URGENTE
                  </span>
                )}
              </div>

              <h4
                style={{
                  fontSize: '0.92rem',
                  lineHeight: 1.25,
                  margin: '3px 0 4px 0',
                }}
              >
                {item.slug ? (
                  <Link
                    href={`/noticia/${item.slug}`}
                    style={{
                      color: 'var(--ink)',
                      textDecoration: 'none',
                      fontWeight: 700,
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--blue-parana)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{item.title}</span>
                )}
              </h4>

              {item.summary && (
                <p
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--ink-soft)',
                    margin: 0,
                    lineHeight: 1.35,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {item.summary}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
