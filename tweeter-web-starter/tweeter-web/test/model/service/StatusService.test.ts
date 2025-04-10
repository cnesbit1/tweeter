import "isomorphic-fetch";
import { StatusService } from '../../../src/model/service/StatusService';
import { AuthToken, Status } from 'tweeter-shared';

describe('StatusService Integration Test', () => {
  const service = new StatusService();

  test('loadMoreStoryItems returns valid Status objects and hasMore flag', async () => {
    const token = new AuthToken('testauthtoken', Date.now());
    const userAlias = '@testuser';

    const [statuses, hasMore] = await service.loadMoreStoryItems(token, userAlias, 10, null);

    expect(Array.isArray(statuses)).toBe(true);
    expect(typeof hasMore).toBe('boolean');
    expect(statuses.length).toBeLessThanOrEqual(10);

    for (const status of statuses) {
      expect(status).toBeInstanceOf(Status);
      expect(status.post).toBeDefined();
      expect(typeof status.post).toBe('string');
      expect(status.timestamp).toBeGreaterThanOrEqual(0);
      expect(status.user).toBeDefined();
      expect(status.user.alias.startsWith('@')).toBe(true);
    }
  });
});