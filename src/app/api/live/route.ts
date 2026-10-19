import { liveBroadcaster, LiveEvent } from '../../../services/live/live-broadcaster';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();

  let unsubscribe: (() => void) | null = null;
  let keepAliveTimer: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      const initialPayload = JSON.stringify({
        type: 'ping',
        payload: { message: 'Conexión SSE establecida con la Redacción' },
        timestamp: Date.now(),
      });
      controller.enqueue(encoder.encode(`data: ${initialPayload}\n\n`));

      // Subscribe to broadcaster
      unsubscribe = liveBroadcaster.subscribe((event: LiveEvent) => {
        try {
          const formatted = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(formatted));
        } catch (err) {
          console.error('Error enqueueing SSE event:', err);
        }
      });

      // Keepalive ping every 15 seconds to prevent timeout
      keepAliveTimer = setInterval(() => {
        try {
          const ping = `data: ${JSON.stringify({ type: 'ping', timestamp: Date.now() })}\n\n`;
          controller.enqueue(encoder.encode(ping));
        } catch {
          if (keepAliveTimer) clearInterval(keepAliveTimer);
        }
      }, 15000);
    },
    cancel() {
      if (unsubscribe) {
        unsubscribe();
      }
      if (keepAliveTimer) {
        clearInterval(keepAliveTimer);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
