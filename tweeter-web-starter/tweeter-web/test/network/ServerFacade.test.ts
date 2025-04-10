import 'isomorphic-fetch';
import { ServerFacade } from '../../src/network/ServerFacade';
import {
  RegisterRequest,
  AuthAliasRequest,
  PagedItemRequest,
  PagedItemResponse,
  CountResponse,
  UserDto,
  UserSessionResponse,
} from 'tweeter-shared';

describe('ServerFacade Integration Tests', () => {
  const serverFacade = new ServerFacade();
  const testAlias = '@allen';
  const testToken = 'testauthtoken';

  test('Register user returns UserSessionResponse', async () => {
    const req: RegisterRequest = {
      firstName: 'Test',
      lastName: 'User',
      alias: testAlias,
      password: 'password',
      userImageBytes: new Uint8Array(),
      imageFileExtension: 'png',
    };

    const response = await serverFacade.register(req);
    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect(response.user).toBeDefined();
    expect(response.user.alias).toBe(testAlias);
    expect(response.user.firstName).toBe('Allen');
    expect(response.user.lastName).toBe('Anderson');
    expect(response.authToken).toBeDefined();
    expect(typeof response.authToken).toBe('string');
  });

  test('Get followers returns expected list', async () => {
    const request: PagedItemRequest<UserDto> = {
      token: testToken,
      userAlias: testAlias,
      pageSize: 10,
      lastItem: null,
    };

    const response: PagedItemResponse<UserDto> =
      await serverFacade.getMoreFollowers(request);
    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect(Array.isArray(response.items)).toBe(true);
    const items = response.items ?? [];

    expect(items.length).toBeLessThanOrEqual(10);
    for (const user of items) {
      expect(user.alias).toMatch(/^@/);
      expect(user.firstName).toBeDefined();
      expect(user.lastName).toBeDefined();
      expect(user.imageUrl).toContain('http');
    }
    expect(typeof response.hasMore).toBe('boolean');
  });

  test('Get followee count returns number', async () => {
    const request: AuthAliasRequest = {
      token: testToken,
      alias: testAlias,
    };

    const response: CountResponse = await serverFacade.getFolloweeCount(
      request
    );
    expect(response.success).toBe(true);
    expect(response.message).toBeNull();
    expect(typeof response.count).toBe('number');
    expect(response.count).toBeGreaterThanOrEqual(0);
  });
});
