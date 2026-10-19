import { describe, it, expect } from 'vitest';
import { LiveBroadcaster, LiveEvent } from '../../src/services/live/live-broadcaster';

describe('LiveBroadcaster', () => {
  it('notifies registered subscribers when a new live event is published', () => {
    const broadcaster = new LiveBroadcaster();
    const received: LiveEvent[] = [];

    const unsubscribe = broadcaster.subscribe((event) => {
      received.push(event);
    });

    broadcaster.publish({
      type: 'news_item',
      payload: { id: '1', title: 'Último momento en Rosario' }
    });

    expect(received.length).toBe(1);
    expect((received[0].payload as any).title).toBe('Último momento en Rosario');

    unsubscribe();
    broadcaster.publish({
      type: 'alert',
      payload: { id: '2', title: 'Alerta de tránsito' }
    });

    expect(received.length).toBe(1); // No new events after unsubscribe
  });
});
