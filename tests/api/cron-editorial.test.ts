import { describe, it, expect, vi } from 'vitest';
import { publishRosarinoEdition } from '../../src/services/ai-editor/rosarino-bot';

describe('12-Hour Autonomous Editorial Cycle', () => {
  it('publishes the full edition to repository and broadcasts via live events', async () => {
    const mockCreatedItems: any[] = [];
    const mockRepo = {
      createNewsItem: vi.fn().mockImplementation(async (item) => {
        const created = { id: `id-${mockCreatedItems.length + 1}`, ...item };
        mockCreatedItems.push(created);
        return created;
      }),
    };

    const mockBroadcaster = {
      publish: vi.fn(),
    };

    const result = await publishRosarinoEdition(mockRepo as any, mockBroadcaster as any);

    expect(result.count).toBeGreaterThanOrEqual(4);
    expect(result.titles).toHaveLength(result.count);
    expect(mockRepo.createNewsItem).toHaveBeenCalledTimes(result.count);
    expect(mockBroadcaster.publish).toHaveBeenCalledTimes(result.count);

    // Verify first event published
    expect(mockBroadcaster.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'news_item',
        payload: expect.objectContaining({
          title: expect.any(String),
        }),
      })
    );
  });
});
