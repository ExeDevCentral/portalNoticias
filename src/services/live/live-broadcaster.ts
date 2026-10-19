export type LiveEventType = 'news_item' | 'alert' | 'ping';

export interface LiveEvent {
  type: LiveEventType;
  payload: Record<string, unknown>;
  timestamp?: number;
}

export type LiveListener = (event: LiveEvent) => void;

export class LiveBroadcaster {
  private readonly listeners: Set<LiveListener> = new Set();

  subscribe(listener: LiveListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  publish(event: LiveEvent): void {
    const fullEvent: LiveEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
    };
    for (const listener of this.listeners) {
      try {
        listener(fullEvent);
      } catch (err) {
        console.error('Error invoking live listener:', err);
      }
    }
  }

  get subscriberCount(): number {
    return this.listeners.size;
  }
}

// Global singleton instance for use across Next.js API routes
const globalForBroadcaster = globalThis as unknown as { liveBroadcaster?: LiveBroadcaster };
export const liveBroadcaster = globalForBroadcaster.liveBroadcaster ?? new LiveBroadcaster();
if (process.env.NODE_ENV !== 'production') {
  globalForBroadcaster.liveBroadcaster = liveBroadcaster;
}
