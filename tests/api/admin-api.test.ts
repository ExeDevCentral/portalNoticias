import { describe, it, expect, vi } from 'vitest';
import { handleCreateAlert } from '../../src/services/admin-service';

describe('AdminService', () => {
  it('creates an alert and publishes to the real-time broadcaster', async () => {
    const mockRepo = {
      createLiveAlert: vi.fn().mockImplementation(async (a) => ({ id: 'a1', ...a }))
    };
    const mockBroadcaster = { publish: vi.fn() };

    const result = await handleCreateAlert(
      { title: 'Corte total en Av. Circunvalación', level: 'critical_red' },
      mockRepo as any,
      mockBroadcaster as any
    );

    expect(result.success).toBe(true);
    expect(mockRepo.createLiveAlert).toHaveBeenCalled();
    expect(mockBroadcaster.publish).toHaveBeenCalledWith(expect.objectContaining({
      type: 'alert',
      payload: expect.objectContaining({ title: 'Corte total en Av. Circunvalación' })
    }));
  });
});
