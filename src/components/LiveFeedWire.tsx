'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NewsItem } from '../db/schema';
import { formatTimeAgo } from '../utils/formatters';

interface LiveFeedWireProps {
  initialItems: NewsItem[];
}

export default function LiveFeedWire({ initialItems }: LiveFeedWireProps) {
  const [items, setItems] = useState<NewsItem[]>(initialItems);
  const [connected, setConnected] = useState(false);

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
    <div style={{ borderLeft: '1px solid var(--ink-faint)', paddingLeft: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3
          className="font-mono"
          style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}
        >
          Cables en Vivo
        </h3>
        <span
          className="badge-deadpan"
          style={{
            margin: 0,
            backgroundColor: connected ? 'var(--paper-elevated)' : 'transparent',
            borderColor: connected ? 'var(--red-urgent)' : 'var(--ink-faint)',
            color: connected ? 'var(--red-urgent)' : 'var(--ink-soft)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.7rem',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: connected ? 'var(--red-urgent)' : 'var(--ink-soft)',
            }}
          />
          {connected ? 'SALA EN DIRECTO' : 'RECONECTANDO'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              borderBottom: '1px solid var(--ink-faint)',
              paddingBottom: '14px',
              animation: 'fadeIn 0.4s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--ink-soft)' }}>
                {item.source} • {formatTimeAgo(item.publishedAt)}
              </span>
              {item.isUrgent && (
                <span
                  style={{
                    backgroundColor: 'var(--red-urgent)',
                    color: '#FFF',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '2px',
                  }}
                >
                  URGENTE
                </span>
              )}
            </div>

            <h4 style={{ fontSize: '1.05rem', lineHeight: 1.25, margin: '4px 0 6px 0' }}>
              {item.slug ? (
                <Link
                  href={`/noticia/${item.slug}`}
                  style={{ color: 'var(--ink)', textDecoration: 'none', fontWeight: 700 }}
                >
                  {item.title}
                </Link>
              ) : (
                <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{item.title}</span>
              )}
            </h4>

            {item.summary && (
              <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', margin: 0, lineHeight: 1.4 }}>
                {item.summary.slice(0, 140)}...
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
